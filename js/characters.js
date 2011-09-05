define(['character'], function(character) {
  return {
    all: [new character()],
    current: function() {
      return this.all[0];
    }
  };
});
