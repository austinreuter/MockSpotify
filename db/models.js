const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);


const songExtension = [
  {
    tableName: 'song_daily_views'
  }, {
    grabAllHistory: function() {
      return this.forge.fetchAll();
    }
  }
];

const pldvExtension = [
  {
  	tableName: 'pl_daily_views',
  }, {
  	playlistHistory: function(playlistID) {
  		return this.forge().query({
  			where: { 
  				playlist_id: playlistID
  			}
  		}).fetchAll();
  	},
  	grabAllHistory: function() {
  		return this.forge().fetchAll();
  	}
  }
];

const pidmExtension = [
  {
    tableName: 'playlist_id_metrics'
  }, {
    grabAllParentIds: function() {
      return this.forge.fetchAll();
    },
    saveToParentTable: function(playlist_id, genre_id, viewCount, time) {
      return this.forge({
        playlist_id: playlist_id,
        genre_id: genre_id,
        totalPlaylistViewCount: viewCount,
        runningTotal: 1,
        created_at: time,
        updated_at: time
      }).save()
      .catch((err) => {
        console.log(err)
      });
    },
    updateParentWithPlaylist: function(playlist_id, viewCount) {
      return this.forge().query({
        where: {
          playlist_id: playlist_id
        }
      })
      .fetch()
      .then((results) => {
        let id = results.attributes.playlist_id;
        let currentViewCount = results.attributes.totalPlaylistViewCount;
        let runningTotal = results.attributes.runningTotal;

        return this.forge()
          .query({where: {id: id}})
          .save({
            totalPlaylistViewCount: currentViewCount + viewCount,
            runningTotal: runningTotal + 1 
          }, {patch: true})
          .catch(err => console.log(err))
      })
    }
  }
];

module.exports.pl_daily_views = bookshelf.Model.extend(...pldvExtension);
module.exports.playlist_id_metrics = bookshelf.Model.extend(...pidmExtension);
module.exports.song_daily_views = bookshelf.Model.extend(...songExtension);