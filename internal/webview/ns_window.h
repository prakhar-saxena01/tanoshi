
#if __APPLE__  
#include <Cocoa/Cocoa.h>
void Center(void *self) {
  NSWindow *window = self;
  [window center];
  window.hasShadow = true;
}
#endif