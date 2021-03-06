// Generated by CoffeeScript 1.8.0
(function() {
  var Decorator;

  Decorator = Ember.Object.extend({
    isolate: {
      get: function(source, type, direction) {
        if (type == null) {
          type = 'famous-dom-consumer';
        }
        if (direction == null) {
          direction = 'up';
        }
        return this.getNearest(source, type);
      },
      getNearest: function(source, type) {
        var parentView, parentViewFamousTypes, parentViewIsFamous;
        parentView = source.get('parentView');
        if (!parentView) {
          return;
        }
        parentViewIsFamous = parentView.get('famous');
        if (!parentViewIsFamous) {
          return this.getNearest(parentView, type);
        }
        parentViewFamousTypes = parentView.get('famous._type');
        if (!parentViewFamousTypes) {
          return;
        }
        if (!parentViewFamousTypes.contains(type)) {
          return this.getNearest(parentView, type);
        }
        return Ember.View.views[parentView.get('elementId')];
      }
    }
  });

  export default Decorator;

}).call(this);

//# sourceMappingURL=Decorator.js.map
