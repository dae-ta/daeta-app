// https://github.com/ZeroCho/food-delivery-app/blob/master/ch1/types/react-native-keyboard-aware-scrollview.d.ts
declare module 'react-native-keyboard-aware-scrollview' {
  import * as React from 'react';
  import {Constructor, ViewProps} from 'react-native';
  class KeyboardAwareScrollViewComponent extends React.Component<ViewProps> {}
  const KeyboardAwareScrollViewBase: KeyboardAwareScrollViewComponent &
    Constructor<any>;
  class KeyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}
  export {KeyboardAwareScrollView};
}
