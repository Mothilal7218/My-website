// Blog Articles Data
// To add a new article, simply copy the template below and fill in your details

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  slug: string;
}

// ============================================
// ADD YOUR ARTICLES HERE
// ============================================
// Template for adding new articles:
/*
{
  id: "unique-id-number",
  title: "Your Article Title",
  excerpt: "A short summary of your article (2-3 sentences)",
  content: `Your full article content here. You can write multiple paragraphs.

  Use backticks for multi-line content. This allows you to write freely.

  You can add as many paragraphs as you want.`,
  date: "Month Day, Year",
  readTime: "X min read",
  category: "Category Name",
  image: "/images/your-image.jpg", // Optional: add an image
  slug: "your-article-url-slug"
}
*/

export const articles: Article[] = [
  {
    id: "1",
    title: "The Silence of Being 23",
    excerpt: "On the unspoken pressure of your early twenties and why it's okay to not have it all figured out.",
    content: `Turning 23 feels like standing at a crossroads where everyone expects you to know exactly where you're going. But the truth is, most of us are just figuring it out as we go along.

    Society tells us that by 23, we should have our careers mapped out, our relationships sorted, and our lives together. But reality is far messier than that.

    I've been there — the late nights questioning every decision, the anxiety of watching peers seemingly glide through life while I felt stuck. This article is for everyone who's felt that pressure and needs to hear that it's okay to be a work in progress.

    Your twenties are not a race. They're a journey of self-discovery, and every stumble is a lesson in disguise.`,
    date: "January 15, 2025",
    readTime: "5 min read",
    category: "Reflection",
    slug: "the-silence-of-being-23"
  },
  {
    id: "2",
    title: "Why I Write in Tanglish",
    excerpt: "The power of speaking your truth in the language that feels most authentic to you.",
    content: `Language is more than just words — it's the vessel of our emotions, our culture, and our identity. For me, writing in Tanglish (a blend of Tamil and English) isn't just a choice; it's a necessity.

    When I write about heartbreak, loneliness, or hope, I find that my thoughts flow most naturally when I'm not confined to one language. Some emotions simply don't translate.

    Tanglish allows me to reach young people in India who think in both languages, who switch between Tamil and English without even realizing it. It makes my writing feel authentic, raw, and real.

    Your voice matters, and it deserves to be heard in whatever language feels most true to you.`,
    date: "December 28, 2024",
    readTime: "4 min read",
    category: "Writing",
    slug: "why-i-write-in-tanglish"
  },
  {
    id: "3",
    title: "Finding Home in a Foreign Land",
    excerpt: "Lessons from France about solitude, self-discovery, and the courage to start over.",
    content: `Moving to France was both the hardest and the best decision I've ever made. In the silence of a new country, I discovered parts of myself I never knew existed.

    The lonely mornings, the struggle with a new language, the feeling of being an outsider — all of it taught me resilience. I learned that home isn't a place; it's a feeling you carry within yourself.

    France taught me that being alone doesn't have to mean being lonely. In fact, solitude can be a gift — a chance to rebuild, to reflect, and to grow.

    This article is for anyone who's ever had to start over in an unfamiliar place. You're stronger than you know.`,
    date: "November 20, 2024",
    readTime: "6 min read",
    category: "Travel",
    slug: "finding-home-in-foreign-land"
  }
];

// Helper function to get article by slug
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug);
}

// Helper function to get articles by category
export function getArticlesByCategory(category: string): Article[] {
  return articles.filter(article => article.category === category);
}

// Helper function to get recent articles
export function getRecentArticles(count: number = 3): Article[] {
  return articles.slice(0, count);
}
