Boks = new Mongo.Collection('boks');

//TODO: replace bok-add-node.js, bok-create.js and fixtures uses

boks = (function(){
  var collection = Boks;

  return {
    addNode: function(config){

      var data = config.data,
          onSuccess = config.onSuccess,
          onError = config.onError,
          extraValidations = config.validations;

      var validations = [];

      var defaults = {
        public: true,
        date_created: Date.now()
      };

      if(data.name === undefined){
        validations.push({ message: 'name property must be provided', data: data });
      }

      if(!typeof data.name === 'string'){
        validations.push({ message: 'name property must be a string', data: data });
      }

      if(!data.name.trim()){
        validations.push({ message: 'name property must not be blank', data: data });
      }

      if(data.ancestors === undefined){
        validations.push({ message: 'ancestors property must be provided', data: data });
      }

      if(!typeof data.ancestors.constructor === Array){
        validations.push({ message: 'ancestors property must be an array', data: data });
      }

      if(data.public === undefined){
        validations.push({ message: 'public property must be provided', data: data });
      }

      if(!typeof data.public.constructor === Boolean){
        validations.push({ message: 'public property must be a boolean', data: data });
      }

      if(data.date_created === undefined){
        validations.push({ message: 'date_created property must be provided', data: data });
      }

      if(!typeof data.date_created.constructor === Number){
        validations.push({ message: 'date_created property must be the result of a JS Date object `Date.now()`', data: data });
      }

      if(validations.length === 0){
        collection.insert(data, function(){
          onSuccess && onSuccess();
        });
      } else {
        onError && onError(validations.reverse());
      }

      return validations.length === 0;
    },
    collection: collection
  }
}());