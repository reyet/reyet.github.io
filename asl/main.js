let ytplayer = undefined;
let currentId = undefined;

function onYouTubeIframeAPIReady() {
  var player = new YT.Player('ytplayer', {
    height: 480,
    width: 640,
    playerVars: {'rel': 0, 'controls': 0, 'modestbranding':1},
    events: {
      'onReady': (e) => { console.log('Ready'); ytplayer = player; loopVideo(); console.log('readydone'); },
       // 'onStateChange': (e) => { console.log(e.data); if (e.data==0) { loopVideo(); }},
      'onError': (e) => { console.log(e.data, currentId); playRandom(); }
    }
  });
}

function get(x) { return document.getElementById(x); }

function randomInt(n) {
  return Math.floor(n * Math.random());
}

function playRandom(s) {
  const [text, id] = videos[randomInt(videos.length)];
  play(text, id);
}

function play(text, id) {
  currentId = id;
  loopVideo();
}

function loopVideo() {
  if (!ytplayer || !currentId) {
    return;
  }
  console.log('Playing');
  ytplayer.loadVideoById({ 
    videoId: currentId
  });
}

function searchFor(query) {
  const best = [];
  const others = [];
  const limit = 100;
  query = query.toLowerCase();
  for (const [text, id, label] of videos) {
    const idx = text.indexOf(query);
    if (idx == 0) {
      best.push([label, id]);
      if (best.length >= limit) {
        break;
      }
    } else if (idx > 0) {
      others.push([label, id]);
    }
  }
  updateResults(best.concat(others).slice(0, limit));
}

function updateResults(results) {
  const box = get('results');
  box.innerHTML = '';
  for (const [text, id] of results) {
    const d = document.createElement('a');
    d.textContent = text;
    d.href = `http://www.youtube.com/watch?v=${id}`;
    d.dataset.id = id;
    box.appendChild(d);
  }
}

function sortVideos() {
  for (const v of videos) {
    v.push(v[0]);
    v[0] = v[0].toLowerCase();
  }
  videos.sort((a, b) => (a[0].localeCompare(b[0])));
}

function init() {
  sortVideos();
  const search = get('search');
  const top = document.querySelector('.top');
  search.addEventListener('input', (e) => { searchFor(search.value); });
  search.addEventListener('focus', (e) => { top.classList.add('keyboard'); });
  search.addEventListener('blur', (e) => {
    top.classList.remove('keyboard');
    window.setTimeout(() => {
      const h = document.querySelector('.hilite');
      if (h) {
        h.scrollIntoViewIfNeeded();
      }
    }, 200);
  });
  get('results').addEventListener('click', (e) => {
    console.log(e);
    const id = e.target.dataset.id;
    if (id) {
      const prev = document.querySelector('.hilite');
      if (prev) { prev.className = ''; }
      e.target.className = 'hilite';
      e.target.scrollIntoViewIfNeeded();
      play(e.target.textContent, id);
      e.preventDefault();
    }
  });
  search.focus();
}
