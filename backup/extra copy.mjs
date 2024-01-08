import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jcwmtyftwfqkpetpuepw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjd210eWZ0d2Zxa3BldHB1ZXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg0ODM4OTgsImV4cCI6MjAxNDA1OTg5OH0.XWMRW9e64tN0EgMslnbscLKRFGUvW2k-vPfNGlmChKs";
const supabase = createClient(supabaseUrl, supabaseKey);

export const createStory = async ({
  image,
  title,
  description,
  category,
  script,
  storyIsPremium,
}) => {
  if (!category) throw new Error("Category seems missing.");
  if (!script) throw new Error("Script seems missing.");

  const cards = textToCards(script);

  if (!title) throw new Error("Title seems missing.");
  if (!image) throw new Error("Image seems missing.");
  if (!description) throw new Error("Description seems missing.");
  if (!category) throw new Error("Category seems missing.");

  const slug = slugify(title);

  const check = await fetchStory(slug);

  if (check) {
    throw new Error("Story already present.");
  }

  const filename = `${slug}.jpg`;

  const imageRes = await fetch(image);
  const imageBlob = await imageRes.blob();

  const imageUploaded = await supabase.storage
    .from("images")
    .upload(filename, imageBlob, {
      cacheControl: "3600",
      contentType: "image/jpeg",
      upsert: true,
    });

  const publicUrl = await supabase.storage
    .from("images")
    .getPublicUrl(filename);

  const cleanDescription = text.replace(/^\s+|\s+$/g, "");

  const tags = cleanDescription.split("\n").map((o) => slugify(o));

  const storyInserted = await supabase.from("stories").insert([
    {
      title,
      slug,
      description: cleanDescription,
      tags,
      script,
      cards,
      background_image: publicUrl.data.publicUrl,
      is_premium: storyIsPremium,
      available_after: new Date(new Date().getTime() + 60 * 60 * 1000),
    },
  ]);

  const cronUrls = [];

  for (const cardIndex in cards) {
    const { title, option1, option2, option3 } = cards[cardIndex];

    const baseUrl = `https://www.englishflow.ai/api/audio/generate/${slug}/${parseInt(cardIndex) + 1
      }`;

    cronUrls.push({ url: `${baseUrl}/${encodeURIComponent(title)}` });

    if (option1)
      cronUrls.push({ url: `${baseUrl}/${encodeURIComponent(option1)}` });
    if (option2)
      cronUrls.push({ url: `${baseUrl}/${encodeURIComponent(option2)}` });
    if (option3)
      cronUrls.push({ url: `${baseUrl}/${encodeURIComponent(option3)}` });
  }

  await supabase.from("cron_links").insert(cronUrls);

  return true;
};

export const fetchCategory = async (tags, status = "all", page = 0) => {
  const { data, error } = await supabase
    .from("stories")
    .select(
      "title, description, slug, tags, background_image, is_premium, created_at"
    )
    .contains("tags", [tags])
    .lt("available_after", new Date().toISOString())
    .order("id", { ascending: false })
    .limit(5);

  return data;
};

export const fetchStory = async (slug) => {
  const { data, error } = await supabase
    .from("stories")
    .select(
      "title, slug, description, background_image, is_premium, cards, created_at"
    )
    .eq("slug", slug);

  return data[0];
  // const cards = data[0]["cards"].slice(page, page + 3);

  // let text = [];

  // for (const card of cards) {
  //   const { title, option1, option2, option3 } = card;

  //   text = [...text, title, option1, option2, option3];
  // }

  // const audio = await audio(text);

  // return { text, audio };
};

export const translate = async (text, targetLang) => {
  const slug = slugify(text.join("-"));

  const { data, error } = await supabase
    .from("translations")
    .select("translations")
    .eq("slug", slug)
    .eq("target_lang", targetLang);

  let translations = [];

  if (!data || !data.length) {
    const rawResponse = await fetch(`https://api-free.deepl.com/v2/translate`, {
      method: "POST",
      body: JSON.stringify({
        source_lang: "EN",
        text,
        target_lang: targetLang,
        formality: "prefer_less",
        preserve_formatting: false,
      }),
      headers: {
        Authorization: `DeepL-Auth-Key cba7cae4-2451-215b-8a41-02beaed3e9d7:fx`,
        "Content-Type": "application/json",
      },
    });

    const response = await rawResponse.json();

    translations = response.translations.map((o) => o.text);

    const { data, error } = await supabase.from("translations").insert([
      {
        slug,
        text,
        target_lang: targetLang,
        translations,
      },
    ]);
  } else {
    translations = data[0].translations;
  }

  return translations;
};

export const generateAudio = async (storySlug, cardNumber, text) => {
  if (text[0] === "-") {
    // Male option
    const blobMale = await getVoiceoverBlob(text, false, true);
    const slugMale = slugify(text);
    const filenameMale = `${storySlug}/${cardNumber}-male-listener-${slugMale}.mp3`;

    const uploadedMale = await supabase.storage
      .from("audio")
      .upload(filenameMale, blobMale, {
        cacheControl: "3600",
        contentType: "audio/mpeg",
        upsert: true,
      });

    const newObjectMale = {
      text: text,
      filename: filenameMale,
      story_slug: storySlug,
      card_number: cardNumber,
      is_narrator: false,
      is_male: true,
    };

    const audioDatabaseResponseMale = await supabase
      .from("audio")
      .insert([newObjectMale]);

    // Female option
    const blobFemale = await getVoiceoverBlob(text, false, false);
    const slugFemale = slugify(text);
    const filenameFemale = `${storySlug}/${cardNumber}-female-listener-${slugFemale}.mp3`;

    const uploadedFemale = await supabase.storage
      .from("audio")
      .upload(filenameFemale, blobFemale, {
        cacheControl: "3600",
        contentType: "audio/mpeg",
        upsert: true,
      });

    const newObjectFemale = {
      text: text,
      filename: filenameFemale,
      story_slug: storySlug,
      card_number: cardNumber,
      is_narrator: false,
      is_male: false,
    };

    const audioDatabaseResponseFemale = await supabase
      .from("audio")
      .insert([newObjectFemale]);
  } else {
    // Male option
    const blobMale = await getVoiceoverBlob(text, true, true);

    const slugMale = slugify(text);

    const filenameMale = `${storySlug}/${cardNumber}-male-narrator-${slugMale}.mp3`;

    const uploadedMale = await supabase.storage
      .from("audio")
      .upload(filenameMale, blobMale, {
        cacheControl: "3600",
        contentType: "audio/mpeg",
        upsert: true,
      });

    const newObjectMale = {
      text: text,
      filename: filenameMale,
      story_slug: storySlug,
      card_number: cardNumber,
      is_narrator: true,
      is_male: true,
    };

    const audioDatabaseResponseMale = await supabase
      .from("audio")
      .insert([newObjectMale]);

    // Female option
    const blobFemale = await getVoiceoverBlob(text, true, false);

    const slugFemale = slugify(text);

    const filenameFemale = `${storySlug}/${cardNumber}-female-narrator-${slugFemale}.mp3`;

    const uploadedFemale = await supabase.storage
      .from("audio")
      .upload(filenameFemale, blobFemale, {
        cacheControl: "3600",
        contentType: "audio/mpeg",
        upsert: true,
      });

    const newObjectFemale = {
      text: text,
      filename: filenameFemale,
      story_slug: storySlug,
      card_number: cardNumber,
      is_narrator: true,
      is_male: false,
    };

    const audioDatabaseResponseFemale = await supabase
      .from("audio")
      .insert([newObjectFemale]);
  }

  return true;
};

export const getAudio = async (
  storySlug = "",
  cardNumbers = [],
  narratorIsMale = false,
  listenerIsMale = false
) => {
  const { data, error } = await supabase
    .from("audio")
    .select("text,filename,is_narrator,is_male")
    .eq("story_slug", storySlug)
    .in("card_number", cardNumbers);

  const audioObject = {};

  const audioStorageResponse = await supabase.storage
    .from("audio")
    .createSignedUrls(
      data
        .filter(
          (o) =>
            (o.is_narrator && o.is_male === narratorIsMale) ||
            (!o.is_narrator && o.is_male === listenerIsMale)
        )
        .map(({ filename }) => filename),
      3600
    );

  for (const oneSigned of audioStorageResponse.data || []) {
    const { text } = data.find((o) => o.filename === oneSigned.path);

    audioObject[text] = oneSigned.signedUrl;
  }

  return audioObject;
};

// export const downloadPreview = async (
//   storySlug = "",
//   cardNumbers = [],
//   narratorIsMale = false,
//   listenerIsMale = false
// ) => {
//   const { data, error } = await supabase
//     .from("audio")
//     .select("text,filename,is_narrator,is_male")
//     .eq("story_slug", storySlug)
//     .in("card_number", cardNumbers);

//   const filenamesOrdered = [];

//   for (const cardNumber of cardNumbers) {
//     const oneAudioNarrator = data.find(
//       (o) =>
//         o.card_number === cardNumber &&
//         o.is_narrator === true &&
//         o.is_male === narratorIsMale
//     );
//     const oneAudioOption = data.find(
//       (o) =>
//         o.card_number === cardNumber &&
//         o.is_narrator === false &&
//         o.is_male === listenerIsMale
//     );

//     if (oneAudioNarrator) filenamesOrdered.push(oneAudioNarrator.filename)
//     if (oneAudioOption) filenamesOrdered.push(oneAudioOption.filename)
//   }

//   const audioObject = {};

//   const audioStorageResponse = await supabase.storage
//     .from("audio")
//     .createSignedUrls(
//       data
//         .filter(
//           (o) =>
//             (o.is_narrator && o.is_male === narratorIsMale) ||
//             (!o.is_narrator && o.is_male === listenerIsMale)
//         )
//         .map(({ filename }) => filename),
//       3600
//     );

//   for (const oneSigned of audioStorageResponse.data || []) {
//     const { text } = data.find((o) => o.filename === oneSigned.path);

//     audioObject[text] = oneSigned.signedUrl;
//   }

//   return audioObject;
// };

export const getVoiceoverBlob = async (text, isNarrator, isMale) => {
  const elevenLabsApiKey = "562d4bb012a21e9e188e0b67dc8b5eff";

  // narrator voice, Matthew, british, calm, middle aged, male, Yko7PKHZNXotIFUBG7I9
  // narrator voice, Bella, american, narration, soft, young, female, EXAVITQu4vr4xnSDxMaL
  // listener voice, Matilda, american, warm, young, female, XrExE9yKIg1WjnnlVkGX
  // listener voice, Liam, american, narration, young, male, TX3LPaxmHKxFdv7VOQHJ

  let voiceId = isNarrator
    ? isMale
      ? "Yko7PKHZNXotIFUBG7I9"
      : "EXAVITQu4vr4xnSDxMaL"
    : isMale
      ? "TX3LPaxmHKxFdv7VOQHJ"
      : "XrExE9yKIg1WjnnlVkGX";

  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?optimize_streaming_latency=0&output_format=mp3_44100_128`;

  const rawResponse = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: isNarrator ? 0.5 : 0.4,
        similarity_boost: isNarrator ? 0.6 : 0.4,
        // style: 0,
        use_speaker_boost: false,
      },
    }),
    headers: {
      "xi-api-key": elevenLabsApiKey,
      "Content-Type": "application/json",
      accept: "audio/mpeg",
    },
  });

  const blob = await rawResponse.blob();

  return blob;
};

export const signIn = async (email) => {
  const redirectTo =
    process.env.NODE_ENV === "production"
      ? "https://www.englishflow.ai/account"
      : "http://localhost:3000/account";

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  return data;
};

export const userData = async (token) => {
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return user;
};

export const cronMinute = async () => {
  const { data, error } = await supabase
    .from("cron_links")
    .select("id,url")
    .order("id", { ascending: true })
    .limit(1);

  if (data[0]) {
    const response = await fetch(data[0].url);

    const { error } = await supabase
      .from("cron_links")
      .delete()
      .eq("id", data[0].id);
  }

  return true;
};

export const generateDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

export const generateUniqueFilename = () => {
  const currentDate = new Date();
  const timestamp = currentDate
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d+/, "");

  const randomString = Math.random().toString(36).substring(2, 8); // Generates a random string

  const uniqueFilename = `${timestamp}_${randomString}`;

  return uniqueFilename;
};

export const slugify = (str = "") => {
  return String(str.replace(/[^\w\s-]/g, ""))
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
};

export const textToCards = (text) => {
  const trimmedOfLeadingAndTrailingNewLines = text.replace(/^\s+|\s+$/g, "");

  const cards = trimmedOfLeadingAndTrailingNewLines.split("\n").map((line) => {
    let result = { title: line };

    const matches = line.match(/\(([^)]+)\)/);

    if (matches && matches.length > 1) {
      const optionsText = matches[1];

      const options = optionsText.split("|").map((option) => option.trim());

      result.title = line.replace(matches[0], "").trim();

      options.forEach((option, index) => {
        result[`option${index + 1}`] = `- ${option}`;
      });
    }

    return result;
  });

  return cards;
};


export const history = [
  {
    title: "Today",
    items: [
      {
        title: "Maria 👧 x Coffee shop ☕️",
        description:
          "Verb: to have to\nAdverbs: often, usually, always, never\nVocabulary: Coffee shop, lifestyle",
        slug: "maria-and-her-love-for-double-shot-espressos",
      },
      {
        title: "Maria 👧 x Coffee shop ☕️",
        description:
          "Verb: to have to\nAdverbs: often, usually, always, never\nVocabulary: Coffee shop, lifestyle",
        slug: "maria-and-her-love-for-double-shot-espressos",
      },
    ],
  },
  {
    title: "Yesterday",
    items: [
      {
        title: "Maria 👧 x Coffee shop ☕️",
        description:
          "Verb: to have to\nAdverbs: often, usually, always, never\nVocabulary: Coffee shop, lifestyle",
        slug: "maria-x-coffee-shop",
      },
    ],
  },
  {
    title: "Last week",
    items: [],
  },
  {
    title: "Last month",
    items: [],
  },
];
