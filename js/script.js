const editor = document.getElementById('editor');
const previewWorkshop = document.getElementById('preview-workshop');
const previewFile = document.getElementById('preview-file');
const buttons = document.querySelectorAll('.buttons button');

document.getElementById('file').onchange = function() {
  var file = this.files[0];
  var reader = new FileReader();
  reader.onload = function(progressEvent) {
    var lines = this.result.split(/\r\n|\n/);
    for (var line = 0; line < lines.length - 1; line++) {
      var parts = lines[line].split(/=(.*)/s);
      switch (parts[0]) {
        case "description":
          editor.value = editor.value + parts[1] + "\n";
          break;
        case "id":
          document.getElementById('id').value = parts[1];
          break;
        case "tags":
          //TODO 
          break;
        case "title":
          document.getElementById('title').value = parts[1];
          break;
        case "version":
          document.getElementById('version').value = parts[1];
          break;
        case "visibility":
          document.getElementById(parts[1]).selected = "true";
          break;
      }
      //console.log(line + ' --> ' + lines[line] + ' --> ' + parts[0] + ":" + parts[1]);
    }
    updatePreview();
  };
  reader.readAsText(file);
};

function updatePreview() {
  let content = editor.value;
  let fileContent = "";
  fileContent = "title=" + document.getElementById('title').value + "\n";
  fileContent = fileContent + "id=" + document.getElementById('id').value + "\n";
  fileContent = fileContent + "version=" + document.getElementById('version').value + "\n";
  fileContent = fileContent + "tags=" + document.getElementById('myMulti').value + "\n";
  fileContent = fileContent + "visibility=" + document.getElementById('visibility').value + "\n";

  const lines = editor.value.split("\n");
  const updatedLines = lines.map(line => `description=${line}`);
  fileContent = fileContent + updatedLines.join("\n");
  
  //Only show <br> outside table and lists
  content = content.replace(/\[th](.*?)\[\/th]/gs, (match) => {
    return match.replace(/\n/g, "<br>");
  });
  content = content.replace(/\[td](.*?)\[\/td]/gs, (match) => {
    return match.replace(/\n/g, "<br>");
  });
  content = content.replace(/\[table](.*?)\[\/table]/gs, (match) => {
    return match.replace(/\n/g, " ");
  });
  
  //Table
  content = content.replace(/\[th\]([\s\S]*?)\[\/th\]/g, '<div class="div-workshop-table-th">$1</div>');
  content = content.replace(/\[td\]([\s\S]*?)\[\/td\]/g, '<div class="div-workshop-table-td">$1</div>');
  content = content.replace(/\[tr\]([\s\S]*?)\[\/tr\]/g, '<div class="div-workshop-table-tr">$1</div>');
  content = content.replace(/\[table\]([\s\S]*?)\[\/table\]/g, '<div class="div-workshop-table">$1</div>');
  
  //List
  content = content.replace(/\[list](.*?)\[\/list]/gs, (match) => {
    return match.replace(/\[\*\]([\s\S]*?)\n/g, '<li>$1</li>');
  });  
  content = content.replace(/\[list](.*?)\[\/list]/gs, (match) => {
    return match.replace(/\n/g, " ");
  });
  content = content.replace(/\[list\](.*?)\[\/list\]\n/g, '<ul>$1</ul>');
  
  //OList
  content = content.replace(/\[olist](.*?)\[\/olist]\n/gs, (match) => {
    return match.replace(/\[\*\]([\s\S]*?)\n/g, '<li>$1</li>');
  });  
  content = content.replace(/\[olist](.*?)\[\/olist]/gs, (match) => {
    return match.replace(/\n/g, " ");
  });
  content = content.replace(/\[olist\]([\s\S]*?)\[\/olist\]/g, '<ol>$1</ol>');
  
  //YouTube URL
  content = content.replace(/([^=](https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9]*))/g, '<img src="https://community.fastly.steamstatic.com/public/shared/images//helpers/widget_example_youtube.jpg" style="width: 100%; height: auto;">');
  
  //Steam store page URL
  //https://store.steampowered.com/app/323190/
  content = content.replace(/([^=](https:\/\/store\.steampowered\.com\/app\/[0-9]*\/))/g, '<img src="https://community.fastly.steamstatic.com/public/shared/images//helpers/widget_example_store.jpg" style="width: 100%; height: auto;">');
  
  //Any other url
  //https://steamcommunity.com/sharedfiles/filedetails/?id=157328145
  content = content.replace(/([^=](https:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=[0-9]*))/g, '<img src="https://community.fastly.steamstatic.com/public/shared/images//helpers/widget_example_workshop.jpg" style="width: 100%; height: auto;">');
  
  content = content.replace(/\[h1\](.*?)\[\/h1\]\n/g, '<h1>$1</h1>');
  content = content.replace(/\[h2\](.*?)\[\/h2\]\n/g, '<h2>$1</h2>');
  content = content.replace(/\[h3\](.*?)\[\/h3\]\n/g, '<h3>$1</h3>');
  content = content.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>');
  content = content.replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>');
  content = content.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>');
  
  content = content.replace(/\[strike\](.*?)\[\/strike\]/g,'<strike>$1</strike>');
  content = content.replace(/\[spoiler\](.*?)\[\/spoiler\]/g,'<span style="background-color: black; color: black;" onclick="this.style.color=\'white\'">$1</span>');
  content = content.replace(/\[noparse\](.*?)\[\/noparse\]/g, '<pre>$1</pre>');
  content = content.replace(/\[hr\]/g, '<hr>');
  content = content.replace(/\[code\](.*?)\[\/code\]/g, '<code>$1</code>');
  content = content.replace(/\[quote=(.*?)\](.*?)\[\/quote\]/g,'<div class="quote-box"><p class="quote-author">Originally posted by <i>$1</i>:</p><p>$2</p></div>');
  content = content.replace(/\[url=(.*?)\](.*?)\[\/url\]/g, '<a class="preview" href="$1" target="_blank" rel="">$2</a>');
  
  
  content = content.replace(/\n/g, '<br>');
  //TODO: 
  //[table noborder=1]
  //will hide the table borders
  //
  //[table equalcells=1]
  //will force the table be full width of the page and for each column to be equal width

  previewWorkshop.innerHTML = content;
  previewFile.value = fileContent;
}

editor.addEventListener('input', updatePreview);

buttons.forEach((button) => {
  button.addEventListener('click', function () {
    const tag = this.getAttribute('data-tag');

    if (tag === 'quote') {
      const selectedText = editor.value.substring(
        editor.selectionStart,
        editor.selectionEnd
      );
      document.getElementById('quoteText').value = selectedText;
      document.getElementById('quoteModal').style.display = 'flex';
      return;
    }

    if (tag === 'url') {
      const selectedText = editor.value.substring(editor.selectionStart, editor.selectionEnd);
      document.getElementById('urlText').value = selectedText;
      document.getElementById('urlModal').style.display = 'flex';
      return;
    }

    let startTag = `[${tag}]`;
    let endTag = tag !== 'hr' ? `[/${tag}]` : ''; // No end tag for [hr]

    const selectionStart = editor.selectionStart;
    const selectionEnd = editor.selectionEnd;

    editor.setRangeText(
      startTag + editor.value.substring(selectionStart, selectionEnd) + endTag,
      selectionStart,
      selectionEnd,
      'select'
    );

    updatePreview();
  });
});

document.getElementById('insertQuote').addEventListener('click', function () {
  const author = document.getElementById('author').value;
  const quote = document.getElementById('quoteText').value;
  const insertion = `[quote=${author}] ${quote} [/quote]`;
  const beforeSelection = editor.value.substring(0, editor.selectionStart);
  const afterSelection = editor.value.substring(
    editor.selectionEnd,
    editor.value.length
  );
  editor.value = beforeSelection + insertion + afterSelection;
  document.getElementById('quoteModal').style.display = 'none';
  updatePreview();
});

document.getElementById('insertUrl').addEventListener('click', function () {
  const url = document.getElementById('urlInput').value;
  const linkText = document.getElementById('urlText').value;
  const insertion = `[url=${url}]${linkText}[/url]`;
  const beforeSelection = editor.value.substring(0, editor.selectionStart);
  const afterSelection = editor.value.substring(editor.selectionEnd, editor.value.length);
  editor.value = beforeSelection + insertion + afterSelection;
  document.getElementById('urlModal').style.display = 'none';
  updatePreview();
});

editor.addEventListener('keydown', function (e) {
  if (e.ctrlKey) {
    // Check if the Control key is pressed
    let tag = '';

    switch (e.key) {
      case 'b':
      case 'B':
        tag = 'b';
        break;
      case 'i':
      case 'I':
        tag = 'i';
        break;
      case 'u':
      case 'U':
        tag = 'u';
        break;
      case 'k':
      case 'K':
        const selectedText = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        document.getElementById('urlText').value = selectedText;
        document.getElementById('urlModal').style.display = 'flex';
        e.preventDefault();
        return;
    }

    if (e.shiftKey) {
      // Check if the Shift key is pressed along with Control key
      switch (e.key) {
        case 'X':
          tag = 'strike';
          break;
        case 'H':
          tag = 'h1';
          break;
      }
    }

    if (tag) {
      const startTag = `[${tag}]`;
      const endTag = tag !== 'hr' ? `[/${tag}]` : ''; // No end tag for [hr]

      const selectionStart = editor.selectionStart;
      const selectionEnd = editor.selectionEnd;

      editor.setRangeText(
        startTag +
          editor.value.substring(selectionStart, selectionEnd) +
          endTag,
        selectionStart,
        selectionEnd,
        'select'
      );

      updatePreview();
      e.preventDefault(); // To prevent any default action for the key combination
    }
  }
});


/* LocalStorage */

// Save to localStorage
function saveTextAsLocalStorage() {
  const text = editor.value;
  localStorage.setItem("markupText", text);
}

// Load from localStorage
function loadTextFromLocalStorage() {
  const savedText = localStorage.getItem("markupText");
  if (savedText) {
      editor.value = savedText;
      updatePreview();
  }
}

// Event listeners
editor.addEventListener('input', function () {
  saveTextAsLocalStorage();  
});

document.addEventListener('DOMContentLoaded', (event) => {
  loadTextFromLocalStorage();
});
