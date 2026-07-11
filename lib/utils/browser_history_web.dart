// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;
void replaceBrowserPath(String path) { if (html.window.location.pathname != path) html.window.history.replaceState(null, '', path); }
void pushBrowserPath(String path) { if (html.window.location.pathname != path) html.window.history.pushState(null, '', path); }
void setBrowserPopStateHandler(void Function(String path) handler) { html.window.onPopState.listen((_) => handler(html.window.location.pathname ?? '/')); }
