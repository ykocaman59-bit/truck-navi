import 'package:flutter/material.dart';

void main() {
  runApp(const TirnavApp());
}

class TirnavApp extends StatelessWidget {
  const TirnavApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'TIRNAV',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF061522),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF008CFF),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.local_shipping,
                size: 90,
                color: Color(0xFF008CFF),
              ),

              const SizedBox(height: 20),

              const Text(
                'TIRNAV',
                style: TextStyle(
                  fontSize: 42,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 2,
                ),
              ),

              const SizedBox(height: 8),

              Text(
                'Tırların Yol Arkadaşı',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey.shade400,
                ),
              ),

              const SizedBox(height: 40),

              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF087FEF),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(280, 55),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Rota Oluştur',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
