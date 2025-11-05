try {
  // Using the exact curl pattern you provided
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      "API Error: " +
        response.status +
        " - " +
        (errorData.error?.message || "Unknown error")
    );
  }

  const data = await response.json();

  // Extract the text from response
  const resumeHTML = data.candidates[0].content.parts[0].text;

  // Clean up the response (remove markdown code blocks if present)
  let cleanHTML = resumeHTML.replace(/```html\n?/g, "").replace(/```\n?/g, "");

  document.getElementById("resumePreview").innerHTML = cleanHTML;
} catch (error) {
  alert(
    "Error generating resume: " +
      error.message +
      "\n\nPlease check your API key and try again."
  );
  console.error("Error:", error);
} finally {
  document.getElementById("loading").classList.remove("active");
  this.disabled = false;
}

// Download PDF Button
document.getElementById("downloadBtn").addEventListener("click", function () {
  window.print();
});

// Copy HTML Button
document.getElementById("copyBtn").addEventListener("click", function () {
  const resumeContent = document.getElementById("resumePreview").innerHTML;

  if (!resumeContent || resumeContent.includes("Fill out the form")) {
    alert("Please generate a resume first!");
    return;
  }

  const fullHTML =
    '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Resume</title>\n    <link rel="stylesheet" href="resume.css">\n</head>\n<body>\n' +
    resumeContent +
    "\n</body>\n</html>";

  const resumeCSS = `body {
font-family: 'Computer Modern', 'Times New Roman', serif;
line-height: 1.4;
font-size: 11pt;
max-width: 800px;
margin: 20px auto;
padding: 40px;
}

.resume-header {
text-align: center;
margin-bottom: 15px;
border-bottom: 1px solid #000;
padding-bottom: 10px;
}

.resume-name {
font-size: 28pt;
font-weight: normal;
letter-spacing: 3px;
margin-bottom: 5px;
font-variant: small-caps;
}

.resume-contact {
font-size: 10pt;
margin: 5px 0;
}

.resume-contact a {
color: #000;
text-decoration: none;
margin: 0 10px;
}

.resume-section {
margin: 15px 0;
}

.resume-section-title {
font-size: 14pt;
font-weight: bold;
border-bottom: 1px solid #000;
margin: 12px 0 8px 0;
padding-bottom: 2px;
}

.resume-item {
margin: 10px 0;
}

.resume-item-header {
display: flex;
justify-content: space-between;
font-weight: bold;
margin-bottom: 2px;
}

.resume-item-subtitle {
font-style: italic;
margin-bottom: 5px;
}

.resume-item-location {
font-style: italic;
text-align: right;
font-size: 10pt;
}

.resume-list {
margin-left: 20px;
margin-top: 5px;
list-style: none;
}

.resume-list li {
margin: 3px 0;
text-indent: -20px;
padding-left: 20px;
}

.resume-list li:before {
content: "• ";
}

.coursework-grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 5px;
margin-left: 20px;
list-style: none;
}

.coursework-grid li:before {
content: "• ";
}

.skill-item {
margin: 5px 0;
}

.skill-label {
font-weight: bold;
}`;

  // Create a downloadable package
  const blob = new Blob(
    [
      "=== RESUME HTML (save as resume.html) ===\n\n",
      fullHTML,
      "\n\n=== RESUME CSS (save as resume.css) ===\n\n",
      resumeCSS,
    ],
    { type: "text/plain" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume-files.txt";
  a.click();
  URL.revokeObjectURL(url);

  alert(
    "Resume files downloaded! The TXT file contains both HTML and CSS. Copy each section into separate files:\n\n1. resume.html\n2. resume.css"
  );
});
