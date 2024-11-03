---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

# layout: default
layout: default
title: "Asset Library"
---
<form id="upload-form">
  <label for="file">Choose a file:</label>
  <input type="file" id="file" name="file">
  <label for="tags">Enter tags (comma-separated):</label>
  <input type="text" id="tags" name="tags">
  <input type="submit" value="Upload">
</form>
<button id="signin-button" onclick="handleAuthClick()">Sign In with Google</button>
<button type="button" onclick="handleSignoutClick()">Sign Out</button>

<script src="upload.js"></script>


<form action="/search" method="get">
  <input type="text" name="query" placeholder="Search for assets...">
  <button type="submit">Search</button>
</form>

<div id="search-results"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.8/lunr.min.js"></script>
<script>
  var postList = [];
  var index = lunr(function() {
  this.ref('id');
    this.field('title');
    this.field('tags');
    this.field('description');
    
    {% for post in site.posts %}
    this.add(
        {
          'id': {{ post.url | jsonify }},
          'title': {{ post.title | jsonify }},
          'tags': {{ post.tags | jsonify }},
          'description': {{ post.description | jsonify }}
        }
    );
    postList.push({
      'url': '{{ post.url }}',
      'title': '{{ post.title }}',
      'tags': '{{ post.tags | jsonify }}',
      'description': '{{ post.description | jsonify }}'
    });
    {% endfor %}
  });

  document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    var query = document.querySelector('input[name="query"]').value;
    var results = index.search(query);

    var resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    results.forEach(function(result) {
      var post = postList.find(p => p.url === result.ref);
      resultsContainer.innerHTML += `<div><a href="${result.ref}">${post.title}</a></div>`;
    });
  });
</script>

<script>
document.getElementById('upload-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const file = formData.get('file');
  const tags = formData.get('tags');

  const response = await fetch('/.netlify/functions/upload', {
    method: 'POST',
    body: JSON.stringify({ file, tags }),
  });

  if (response.ok) {
    alert('File uploaded successfully!');
  } else {
    alert('File upload failed.');
  }
});
</script>
