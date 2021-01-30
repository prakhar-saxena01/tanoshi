#include "ns_window.h"
void Center(void *self) {
  NSWindow *window = self;
  [window center];
  window.hasShadow = true;
}