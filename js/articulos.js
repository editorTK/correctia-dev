document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('article-form');
    const topicInput = document.getElementById('article-topic');
    const toneSelect = document.getElementById('article-tone');
    const customToneInput = document.getElementById('custom-tone');
    const sizeSelect = document.getElementById('article-size');
    const keywordsInput = document.getElementById('article-keywords');
    const toggleAdvancedBtn = document.getElementById('toggle-advanced');
    const advancedSection = document.getElementById('advanced-section');
    const audienceAgeInput = document.getElementById('audience-age');
    const markdownSelect = document.getElementById('markdown-format');
    const readingLevelSelect = document.getElementById('reading-level');
    const grammarCustomInput = document.getElementById('grammar-custom');
    const resultSection = document.getElementById('article-result-section');
    const result = document.getElementById('article-result');
    const copyArticleBtn = document.getElementById('copy-article');

    toneSelect.addEventListener('change', () => {
        if (toneSelect.value === 'custom') {
            customToneInput.classList.remove('hidden');
        } else {
            customToneInput.classList.add('hidden');
            customToneInput.value = '';
        }
    });

    toggleAdvancedBtn.addEventListener('click', () => {
        advancedSection.classList.toggle('hidden');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const topic = topicInput.value.trim();
        if (!topic) return;

        const tone = toneSelect.value;
        const customTone = customToneInput.value.trim();
        const size = sizeSelect.value;
        const keywords = keywordsInput.value.trim();
        const audienceAge = audienceAgeInput.value.trim();
        const markdown = markdownSelect.value;
        const readingLevel = readingLevelSelect.value;
        const grammarCustom = grammarCustomInput.value.trim();

        let prompt = `Redacta un articulo detallado sobre: ${topic}`;

        if (tone === 'custom' && customTone) {
            prompt += `. Tono: ${customTone}`;
        } else if (tone) {
            prompt += `. Tono: ${tone}`;
        }
        if (size) prompt += `. Tama\u00f1o: ${size}`;
        if (keywords) prompt += `. Incluye las palabras clave: ${keywords}`;
        if (audienceAge) prompt += `. Público objetivo de edad ${audienceAge}`;
        if (readingLevel) prompt += `. Nivel de lectura: ${readingLevel}`;
        if (grammarCustom) prompt += `. Ajustes gramaticales: ${grammarCustom}`;
        if (markdown === 'si') {
            prompt += `. Formatea el resultado en Markdown`;
        } else {
            prompt += `. No uses formato Markdown en el resultado`;
        }

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
});
