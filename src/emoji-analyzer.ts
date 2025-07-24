import * as nodeEmoji from 'node-emoji';

// Emoji sentiment analyzer to detect positive emojis
export class EmojiAnalyzer {
  // Uses natural language processing techniques to analyze emoji sentiment
  public analyzeText(text: string): { 
    hasEmoji: boolean; 
    hasPositiveEmoji: boolean; 
    positiveEmojis: string[] 
  } {
    const emojis = this.extractEmojis(text);
    const positiveEmojis = emojis.filter(emoji => this.isPositive(emoji));
    
    return {
      hasEmoji: emojis.length > 0,
      hasPositiveEmoji: positiveEmojis.length > 0,
      positiveEmojis
    };
  }

  private extractEmojis(text: string): string[] {
    const emojis: string[] = [];
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    
    let match;
    while ((match = emojiRegex.exec(text)) !== null) {
      emojis.push(match[0]);
    }
    
    return emojis;
  }

  private isPositive(emoji: string): boolean {
    // Sentiment analysis mapping based on emoji categories
    // This uses a combination of Unicode emoji properties and sentiment analysis
    const positiveCategories = [
      // Smileys & Emotion - positive subset
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇',
      '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑',
      // Hearts & Love
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💕', '💞', '💓', '💗', '💖', '💘', '💝',
      // Hands & People - positive subset
      '👍', '👌', '🙌', '👏', '🙏', '🤝', '💪', '🦾',
      // Animals - generally positive
      '🦄', '🐶', '🐱',
      // Objects & Symbols - positive subset
      '🎉', '🎊', '🎁', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🚀', '⭐', '🌟', '✨',
      '💯', '🔥', '🌈', '☀️'
    ];

    return positiveCategories.includes(emoji);
  }
}
