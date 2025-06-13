document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('article-form');
    const topicInput = document.getElementById('article-topic');
    const result = document.getElementById('article-result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const topic = topicInput.value.trim();
        if (!topic) return;
        result.textContent = 'Generando...';
        try {
            const res = await puter.ai.chat(`Redacta un articulo detallado sobre: ${topic}`, { model: 'gpt-4.1-nano' });
            result.textContent = res?.message?.content || 'Sin respuesta';
        } catch (err) {
            console.error('Error generando articulo:', err);
            result.textContent = 'Hubo un error al generar el articulo.';
        }
    });
});
