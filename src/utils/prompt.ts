interface PromptData {
  query?: string;
  currentHtml?: string;
  currentFeedback?: string;
  theme?: string;
}

export function constructPrompt(data: PromptData): string {
  const { query = '', currentHtml = '', currentFeedback = '', theme = 'system' } = data;
  const hasFeedback = currentFeedback.length > 0;
  
  return `${currentHtml ? `<current html>${currentHtml}</current html>` : ''}
${currentFeedback ? `<feedback>${currentFeedback}</feedback>` : ''}
${!hasFeedback && query ? `<query>Generate a single HTML file based on this query: "${query}"</query>` : ''}
${`<output instructions>
The output should be valid HTML and should be creative and well-structured. Use Tailwind CSS, load it in the <head> tag with <script src="https://cdn.tailwindcss.com"></script>.
The app should follow the user's ${theme} theme preference. ${theme === 'dark' ? 'Use darker background colors and lighter text colors.' : theme === 'light' ? 'Use lighter background colors and darker text colors.' : 'Use a neutral color scheme that works well in both light and dark modes.'} Make sure the colors have good contrast and are accessible.
Return the HTML content wrapped in triple backticks with 'html' language specifier, like this:
\`\`\`html
<your html code here>
\`\`\`
</output instructions>`}
`.trim();
}
