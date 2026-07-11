import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData light() {
    return ThemeData(
      useMaterial3: true,
      colorSchemeSeed: const Color(0xFF2563EB),
      textTheme: Typography.material2021().black.apply(fontSizeFactor: 1.08),
      scaffoldBackgroundColor: const Color(0xFFF3F4F6),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        isDense: false,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.transparent),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.transparent),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF2563EB)),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14), textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600))),
      outlinedButtonTheme: OutlinedButtonThemeData(style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14), textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600))),
      textButtonTheme: TextButtonThemeData(style: TextButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10), textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600))),
      chipTheme: const ChipThemeData(labelStyle: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
      dataTableTheme: const DataTableThemeData(dataTextStyle: TextStyle(fontSize: 14), headingTextStyle: TextStyle(fontSize: 14, fontWeight: FontWeight.w700), horizontalMargin: 14, columnSpacing: 22),
      listTileTheme: const ListTileThemeData(titleTextStyle: TextStyle(fontSize: 15, color: Colors.black87), minVerticalPadding: 10),
      cardTheme: CardThemeData(
        color: Colors.white,
        surfaceTintColor: Colors.white,
        margin: const EdgeInsets.symmetric(vertical: 8),
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}
