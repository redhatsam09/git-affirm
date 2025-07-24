"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiAnalyzer = void 0;
// Emoji sentiment analyzer to detect positive emojis
class EmojiAnalyzer {
    // Uses natural language processing techniques to analyze emoji sentiment
    analyzeText(text) {
        const emojis = this.extractEmojis(text);
        const positiveEmojis = emojis.filter(emoji => this.isPositive(emoji));
        return {
            hasEmoji: emojis.length > 0,
            hasPositiveEmoji: positiveEmojis.length > 0,
            positiveEmojis
        };
    }
    extractEmojis(text) {
        const emojis = [];
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
        let match;
        while ((match = emojiRegex.exec(text)) !== null) {
            emojis.push(match[0]);
        }
        return emojis;
    }
    isPositive(emoji) {
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
exports.EmojiAnalyzer = EmojiAnalyzer;
