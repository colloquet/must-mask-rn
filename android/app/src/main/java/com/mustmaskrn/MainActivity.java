package com.mustmask;

import com.facebook.react.ReactActivity;
import android.view.WindowManager;
import android.os.Build;
import android.os.Bundle;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "MustMaskRN";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

//  @Override
//  protected void onCreate(Bundle savedInstanceState) {
//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
//      WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams();
//      layoutParams.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_DEFAULT;
//      getWindow().setAttributes(layoutParams);
//      getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
//      getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
//    }
//    super.onCreate(savedInstanceState);
//  }
}
