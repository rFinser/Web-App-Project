const FB_ACCESSS_TOKEN = "INSERT ACCES TOKEN HERE";
const FB_PAGE_ID = "INSERT PAGE ID HERE";

async function FBpost(req, res) {
    const messageBody = { message: req.body.message }

    const response = await fetch(`https://graph.facebook.com/v20.0/${FB_PAGE_ID}/feed?access_token=${FB_ACCESSS_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageBody)
    })
    if (!response.ok) {
        res.status(500);
    }
    else {
        const data = await response.json();
        res.json(data);
    }
}

module.exports = {
    FBpost
}