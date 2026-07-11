// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;
void replaceBrowserPath(String path) { if (html.window.location.pathname != path) html.window.history.replaceState(null, '', path); }
void pushBrowserPath(String path) { if (html.window.location.pathname != path) html.window.history.pushState(null, '', path); }
