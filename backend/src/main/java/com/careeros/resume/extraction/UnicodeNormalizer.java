package com.careeros.resume.extraction;

import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.regex.Pattern;

/**
 * Normalizes Unicode ligatures, typographic quotes, dashes, whitespace,
 * and linebreaks while strictly preserving programming terms like C++, C#, .NET, Node.js.
 */
@Component
public class UnicodeNormalizer {

    private static final Pattern MULTI_SPACE = Pattern.compile("[ \\t\\f\\r]+");
    private static final Pattern EXCESS_NEWLINES = Pattern.compile("\\n{3,}");
    private static final Pattern CONTROL_CHARS = Pattern.compile("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]");

    public String normalize(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        String text = input;

        // 1. Remove non-printable control characters (preserving tab and newline)
        text = CONTROL_CHARS.matcher(text).replaceAll("");

        // 2. Normalize Unicode ligatures
        text = text
                .replace("\uFB00", "ff")
                .replace("\uFB01", "fi")
                .replace("\uFB02", "fl")
                .replace("\uFB03", "ffi")
                .replace("\uFB04", "ffl")
                .replace("\uFB05", "ft")
                .replace("\uFB06", "st");

        // 3. Normalize typographic quotes & apostrophes
        text = text
                .replace('\u2018', '\'')
                .replace('\u2019', '\'')
                .replace('\u201A', '\'')
                .replace('\u201B', '\'')
                .replace('\u201C', '"')
                .replace('\u201D', '"')
                .replace('\u201E', '"')
                .replace('\u201F', '"')
                .replace('\u00AB', '"')
                .replace('\u00BB', '"');

        // 4. Normalize dashes and hyphens (preserving hyphenated terms)
        text = text
                .replace('\u2013', '-')
                .replace('\u2014', '-')
                .replace('\u2015', '-')
                .replace('\u2212', '-');

        // 5. Normalize bullets to standard bullet points
        text = text
                .replace('\u2022', '\n')
                .replace('\u2023', '\n')
                .replace('\u25E6', '\n')
                .replace('\u2043', '\n')
                .replace('\u2219', '\n')
                .replace('\u25AA', '\n')
                .replace('\u25CF', '\n');

        // 6. Normalize non-breaking and unusual spaces to standard space
        text = text
                .replace('\u00A0', ' ')
                .replace('\u2000', ' ')
                .replace('\u2001', ' ')
                .replace('\u2002', ' ')
                .replace('\u2003', ' ')
                .replace('\u2004', ' ')
                .replace('\u2005', ' ')
                .replace('\u2006', ' ')
                .replace('\u2007', ' ')
                .replace('\u2008', ' ')
                .replace('\u2009', ' ')
                .replace('\u200A', ' ')
                .replace('\u202F', ' ')
                .replace('\u205F', ' ')
                .replace('\u3000', ' ');

        // 7. Strip zero-width characters
        text = text
                .replace("\u200B", "")
                .replace("\u200C", "")
                .replace("\u200D", "")
                .replace("\uFEFF", "");

        // 8. NFKC Normalization for any remaining composite characters
        text = Normalizer.normalize(text, Normalizer.Form.NFKC);

        // 9. Clean excessive spacing while preserving line breaks
        String[] lines = text.split("\\r?\\n");
        StringBuilder cleaned = new StringBuilder();
        for (String line : lines) {
            String trimmedLine = MULTI_SPACE.matcher(line).replaceAll(" ").trim();
            if (!trimmedLine.isEmpty()) {
                cleaned.append(trimmedLine).append("\n");
            } else {
                cleaned.append("\n");
            }
        }

        String result = EXCESS_NEWLINES.matcher(cleaned.toString()).replaceAll("\n\n").trim();
        return result;
    }
}
