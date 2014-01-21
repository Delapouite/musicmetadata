var path   = require('path');
var fs     = require('fs');
var mm    = require('../lib/index');
var test   = require('tape');

function blobbyBuilder (data) {
  try {
    return new Blob([data]);
  } catch (e) {
    var bb = new BlobBuilder();
    bb.append(data);
    return bb.getBlob();
  }
}

test('id3v1.1-js', function (t) {
  var blob = blobbyBuilder(new Uint8Array([
    0x00,0x00,0x00,0x00,0x00,0x54,0x41,0x47,0x42,0x6c,0x6f,0x6f,0x64,0x20,0x53,0x75,
    0x67,0x61,0x72,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x00,0x50,0x65,0x6e,0x64,0x75,0x6c,0x75,0x6d,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,0x42,0x6c,0x6f,0x6f,0x64,0x20,0x53,0x75,0x67,0x61,0x72,0x20,
    0x28,0x53,0x69,0x6e,0x67,0x6c,0x65,0x29,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
    0x00,0x00,0x32,0x30,0x30,0x37,0x61,0x62,0x63,0x64,0x65,0x66,0x67,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
    0x00,0x00,0x00,0x01,0x34]));

  t.plan(16);
  new mm(blob)
    .on('metadata', function (result) {
      t.strictEqual(result.title, 'Blood Sugar', 'title');
      t.strictEqual(result.artist[0], 'Pendulum', 'artist');
      t.strictEqual(result.albumartist.length, 0, 'albumartist length');
      t.strictEqual(result.album, 'Blood Sugar (Single)', 'album');
      t.strictEqual(result.year, '2007', 'year');
      t.strictEqual(result.track.no, 1, 'track no');
      t.strictEqual(result.track.of, 0, 'track of');
      t.strictEqual(result.genre[0], 'Electronic', 'genre');
    })
    .on('title', function (result) {
      t.strictEqual(result, 'Blood Sugar', 'title');
    })
    .on('artist', function (result) {
      t.strictEqual(result[0], 'Pendulum', 'artist');
    })
    .on('album', function (result) {
      t.strictEqual(result, 'Blood Sugar (Single)', 'album');
    })
    .on('year', function (result) {
      t.strictEqual(result, '2007', 'year');
    })
    .on('track', function (result) {
      t.strictEqual(result.no, 1, 'track no');
      t.strictEqual(result.of, 0, 'track of');
    })
    .on('genre', function (result) {
      t.strictEqual(result[0], 'Electronic', 'genre');
    })
    .on('comment', function (result) {
      t.strictEqual(result[0], 'abcdefg', 'comment');
    })
    .on('done', function (err) {
      if (err) throw err;
      t.end();
    });
});