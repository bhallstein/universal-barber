//
// recursive-obj-copy.js - recursively copy an object, using a function
//                         to copy values
//

export default function recursive_obj_copy(obj, f, f_treat_object_as_item) {
  if (obj.constructor === Object && f_treat_object_as_item(obj)) {
    return f(null, obj);
  }

  return Object.keys(obj).reduce((accum, k) => {
    const value = obj[k];
    let copied;

    if (value.constructor === Array) {
      copied = value.map(item => recursive_obj_copy(item, f, f_treat_object_as_item));
    }

    else if (value.constructor === Object && !f_treat_object_as_item(value)) {
      copied = recursive_obj_copy(value, f, f_treat_object_as_item);
    }

    else {
      copied = f(k, value);
    }

    if (copied !== null && copied !== undefined) {
      accum[k] = copied;
    }
    return accum;
  }, { });
}

