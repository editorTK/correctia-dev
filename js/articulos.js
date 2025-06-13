document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('article-form');
    const topicInput = document.getElementById('article-topic');
    const toneSelect = document.getElementById('article-tone');
    const sizeSelect = document.getElementById('article-size');
    const keywordsInput = document.getElementById('article-keywords');
    const result = document.getElementById('article-result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const topic = topicInput.value.trim();
        if (!topic) return;
        const tone = toneSelect.value;
        const size = sizeSelect.value;
        const keywords = keywordsInput.value.trim();
        let prompt = `Redacta un articulo detallado sobre: ${topic}`;
        if (tone) prompt += `. Tono: ${tone}`;
        if (size) prompt += `. Tama\u00f1o: ${size}`;
        if (keywords) prompt += `. Incluye las palabras clave: ${keywords}`;
        result.textContent = 'Generando...';
        try {
            const res = await puter.ai.chat(prompt, { model: 'gpt-4.1-nano' });
            result.textContent = res?.message?.content || 'Sin respuesta';
        } catch (err) {
            console.error('Error generando articulo:', err);
            result.textContent = 'Hubo un error al generar el articulo.';
        }
    });
});
