riot.tag('todo', '<h3>TODO4</h3> <h3>{ MyVar }</h3>', function(opts) {
// ..on every update
this.MyVar = 'james brown3';

this.on('update', function () {});
});