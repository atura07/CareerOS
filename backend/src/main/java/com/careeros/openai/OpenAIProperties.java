package com.careeros.openai;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "openai")
@Getter
@Setter
public class OpenAIProperties {

    /**
     * OpenAI API Key from environment variable OPENAI_API_KEY.
     */
    private String apiKey;

    /**
     * Model identifier from environment variable OPENAI_MODEL, defaults to gpt-4o-mini.
     */
    private String model = "gpt-4o-mini";

    /**
     * Base URL for OpenAI API (default https://api.openai.com/v1).
     */
    private String baseUrl = "https://api.openai.com/v1";

    /**
     * Timeout in seconds for OpenAI HTTP requests.
     */
    private int timeoutSeconds = 45;
}
