document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('article-form');
    const topicInput = document.getElementById('article-topic');
    const toneSelect = document.getElementById('article-tone');
    const customToneInput = document.getElementById('custom-tone');
    const sizeSelect = document.getElementById('article-size');
    const keywordsInput = document.getElementById('article-keywords');
    const languageSelect = document.getElementById('article-language');
    const customLanguageInput = document.getElementById('custom-language');
    const toggleAdvancedBtn = document.getElementById('toggle-advanced');
    const advancedSection = document.getElementById('advanced-section');
    const audienceAgeInput = document.getElementById('audience-age');
    const markdownSelect = document.getElementById('markdown-format');
    const readingLevelSelect = document.getElementById('reading-level');
    const personGrammarSelect = document.getElementById('person-grammar');
    const resultSection = document.getElementById('article-result-section');
    const result = document.getElementById('article-result');
    const copyArticleBtn = document.getElementById('copy-article');
    const convertHtmlBtn = document.getElementById('convert-html');
    const htmlSelect = document.getElementById('html-format');
    const swipeHint = document.getElementById('swipe-hint');
    let lastLanguage = 'español';

    toneSelect.addEventListener('change', () => {
        if (toneSelect.value === 'custom') {
            customToneInput.classList.remove('hidden');
        } else {
            customToneInput.classList.add('hidden');
            customToneInput.value = '';
        }
    });

    languageSelect.addEventListener('change', () => {
        if (languageSelect.value === 'otro') {
            customLanguageInput.classList.remove('hidden');
        } else {
            customLanguageInput.classList.add('hidden');
            customLanguageInput.value = '';
        }
    });

    toggleAdvancedBtn.addEventListener('click', () => {
        advancedSection.classList.toggle('hidden');
    });

    htmlSelect.addEventListener('change', () => {
        if (htmlSelect.value === 'si') {
            convertHtmlBtn.classList.add('hidden');
        } else {
            convertHtmlBtn.classList.remove('hidden');
        }
    });
    // Ejecutar una vez al cargar
    if (htmlSelect.value === 'si') {
        convertHtmlBtn.classList.add('hidden');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const topic = topicInput.value.trim();
        if (!topic) return;

        const tone = toneSelect.value;
        const customTone = customToneInput.value.trim();
        const size = sizeSelect.value;
        const keywords = keywordsInput.value.trim();
        const language = languageSelect.value === 'otro' ? customLanguageInput.value.trim() : languageSelect.value;
        const audienceAge = audienceAgeInput.value.trim();
        const markdown = markdownSelect.value;
        const htmlFormat = htmlSelect.value;
        const readingLevel = readingLevelSelect.value;
        const personGrammar = personGrammarSelect.value;

        if (markdown === 'si' && htmlFormat === 'si') {
            alert('No puedes seleccionar Markdown y HTML a la vez.');
            return;
        }

        let prompt = `Redacta un articulo detallado en ${language} sobre: ${topic}`;

        if (tone === 'custom' && customTone) {
            prompt += `. Tono: ${customTone}`;
        } else if (tone) {
            prompt += `. Tono: ${tone}`;
        }
        if (size) prompt += `. Tama\u00f1o: ${size}`;
        if (keywords) prompt += `. Incluye las palabras clave: ${keywords}`;
        if (audienceAge) prompt += `. Público objetivo de edad ${audienceAge}`;
        if (readingLevel) prompt += `. Nivel de lectura: ${readingLevel}`;
        if (personGrammar) prompt += `. Persona gramatical: ${personGrammar}`;
        if (markdown === 'si') {
            prompt += `. Formatea el resultado en Markdown`;
        } else {
            prompt += `. No uses formato Markdown en el resultado`;
        }
        if (htmlFormat === 'si') {
            prompt += `. Devuelve el artículo en formato HTML en ${language}`;
        }
        prompt += `. Devuelve únicamente el artículo sin explicaciones.`;

        lastLanguage = language;
        resultSection.classList.remove('hidden');
        result.textContent = 'Generando...';
        try {
            const res = await puter.ai.chat(prompt, { model: 'gpt-4.1-nano' });
            result.textContent = res?.message?.content || 'Sin respuesta';
        } catch (err) {
            console.error('Error generando articulo:', err);
            result.textContent = 'Hubo un error al generar el articulo.';
        }
    });

    copyArticleBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(result.innerText).then(() => {
            copyArticleBtn.innerText = '¡Copiado!';
            setTimeout(() => { copyArticleBtn.innerText = 'Copiar'; }, 2000);
        });
    });

    const isMarkdown = (text) => /(^#|\*\*|\*|`|\-|\d+\. )/m.test(text);

    convertHtmlBtn.addEventListener('click', async () => {
        const article = result.innerText.trim();
        if (!article) return;
        if (!localStorage.getItem('swipeHintShown')) {
            swipeHint.classList.remove('hidden');
            swipeHint.classList.add('animate-bounce');
            setTimeout(() => { swipeHint.classList.add('hidden'); }, 4000);
            localStorage.setItem('swipeHintShown', '1');
        }

        let htmlPrompt = `Eres un experto en transformar formato texto a HTML. Transforma este artículo en formato HTML. Devuelve únicamente el código, sin explicaciones ni nada extra, y responde en el idioma del artículo. No agregues código JavaScript, solo HTML y un poco de CSS para mostrar el texto de manera visualmente atractiva.`;
        if (isMarkdown(article)) {
            htmlPrompt += ' Sigue la estructura del formato Markdown para transformarlo en HTML.';
        }
        convertHtmlBtn.disabled = true;
        const originalText = convertHtmlBtn.innerText;
        convertHtmlBtn.innerText = '🧠 ...';
        try {
            const res = await puter.ai.chat(`${htmlPrompt}\n\n---\n\n${article}`, { model: 'gpt-4.1-nano' });
            result.textContent = res?.message?.content || 'Sin respuesta';
        } catch (err) {
            console.error('Error convirtiendo a HTML:', err);
        } finally {
            convertHtmlBtn.disabled = false;
            convertHtmlBtn.innerText = originalText;
        }
    });
});
