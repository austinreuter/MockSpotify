module.exports.condesePlaylists = function(playlists) {
  return playlists.reduce((results, playlist) => {
    var id = playlist.playlist_id;
    if (results[id]) { 
      results[id].views ++ 
    } else {
      results[id].views = 1, results[id].genre_id = playlist.genre_id;
    }
    return results;
  });
}