import axios from 'axios'
import FormData from 'form-data';


export async function correctTest(req, res) {
    try {
        const image = req.files['image'] ? req.files['image'][0] : null
        const pdf = req.files['pdf'] ? req.files['pdf'][0] : null;
        const day = req.body.day
        if (!image || !pdf || !day) {
            return res.status(400).json({ erro: "Faltam arquivos ou o day da prova." });
        }

        const form = new FormData();
        form.append('image', image.buffer, { filename: image.originalname })
        form.append('pdf', pdf.buffer, { filename: pdf.originalname })
        form.append('day', day)

        console.log("Enviando arquivos para o Python");

        const pythonResponse = await axios.post('http://localhost:8000/corrigir-prova', form, {
            headers: {
                ...form.getHeaders()
            },
            timeout: 15000
        });
        return res.status(200).json(pythonResponse.data);

    


    } catch (error) {
        console.error("Erro ao comunicar com a API Python:", error.message);
        
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        return res.status(500).json({ erro: "Erro interno no servidor de processamento." });
        
    }
}