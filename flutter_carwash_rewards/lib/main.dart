import 'package:flutter/material.dart';

void main() {
  runApp(const CarwashRewardsApp());
}

class CarwashRewardsApp extends StatelessWidget {
  const CarwashRewardsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Carwash Rewards',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      ),
      home: const RewardsHomePage(),
    );
  }
}

class RewardsTransaction {
  RewardsTransaction({
    required this.title,
    required this.points,
    required this.date,
    required this.isEarn,
  });

  final String title;
  final int points;
  final DateTime date;
  final bool isEarn;
}

class RewardItem {
  RewardItem({required this.name, required this.cost});

  final String name;
  final int cost;
}

class RewardsHomePage extends StatefulWidget {
  const RewardsHomePage({super.key});

  @override
  State<RewardsHomePage> createState() => _RewardsHomePageState();
}

class _RewardsHomePageState extends State<RewardsHomePage> {
  int points = 45;

  final List<RewardsTransaction> transactions = [
    RewardsTransaction(
      title: 'ล้างรถ Premium',
      points: 20,
      date: DateTime.now().subtract(const Duration(days: 2)),
      isEarn: true,
    ),
    RewardsTransaction(
      title: 'ล้างรถ Standard',
      points: 10,
      date: DateTime.now().subtract(const Duration(days: 6)),
      isEarn: true,
    ),
    RewardsTransaction(
      title: 'แลกกาแฟฟรี',
      points: 15,
      date: DateTime.now().subtract(const Duration(days: 10)),
      isEarn: false,
    ),
  ];

  final List<RewardItem> rewardItems = [
    RewardItem(name: 'ส่วนลด 50 บาท', cost: 40),
    RewardItem(name: 'ล้างรถฟรี 1 ครั้ง', cost: 80),
    RewardItem(name: 'เคลือบเงาฟรี', cost: 120),
  ];

  String get memberTier {
    if (points >= 120) return 'Gold';
    if (points >= 60) return 'Silver';
    return 'Classic';
  }

  void resetDemoData() {
    setState(() {
      points = 45;
      transactions
        ..clear()
        ..addAll([
          RewardsTransaction(
            title: 'ล้างรถ Premium',
            points: 20,
            date: DateTime.now().subtract(const Duration(days: 2)),
            isEarn: true,
          ),
          RewardsTransaction(
            title: 'ล้างรถ Standard',
            points: 10,
            date: DateTime.now().subtract(const Duration(days: 6)),
            isEarn: true,
          ),
          RewardsTransaction(
            title: 'แลกกาแฟฟรี',
            points: 15,
            date: DateTime.now().subtract(const Duration(days: 10)),
            isEarn: false,
          ),
        ]);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('รีเซ็ตข้อมูลทดสอบแล้ว')),
    );
  }

  void addWashPoints(int value, String packageName) {
    setState(() {
      points += value;
      transactions.insert(
        0,
        RewardsTransaction(
          title: 'รับแต้มจาก $packageName',
          points: value,
          date: DateTime.now(),
          isEarn: true,
        ),
      );
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('เพิ่มแต้ม $value คะแนนเรียบร้อย')),
    );
  }

  void redeemReward(RewardItem item) {
    if (points < item.cost) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('แต้มไม่พอสำหรับการแลกรางวัลนี้')),
      );
      return;
    }

    setState(() {
      points -= item.cost;
      transactions.insert(
        0,
        RewardsTransaction(
          title: 'แลกรางวัล: ${item.name}',
          points: item.cost,
          date: DateTime.now(),
          isEarn: false,
        ),
      );
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('แลก ${item.name} สำเร็จ')),
    );
  }

  String _dateToText(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/'
        '${date.month.toString().padLeft(2, '0')}/'
        '${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('แอปสะสมแต้มร้านล้างรถ'),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: resetDemoData,
            tooltip: 'รีเซ็ตข้อมูลทดสอบ',
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'สวัสดีคุณลูกค้า',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '$points แต้ม',
                        style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Chip(
                        label: Text('ระดับสมาชิก: $memberTier'),
                        backgroundColor: Colors.blue.shade100,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'โหมดทดสอบ',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              const Text(
                'กดปุ่มด้านบนขวาเพื่อรีเซ็ตข้อมูลเป็นค่าเริ่มต้น และทดสอบการเพิ่มแต้ม/แลกรางวัลได้ทันที',
              ),
              const SizedBox(height: 16),
              const Text(
                'เพิ่มแต้มด่วน',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  ElevatedButton(
                    onPressed: () => addWashPoints(10, 'Standard'),
                    child: const Text('+10 Standard'),
                  ),
                  ElevatedButton(
                    onPressed: () => addWashPoints(20, 'Premium'),
                    child: const Text('+20 Premium'),
                  ),
                  ElevatedButton(
                    onPressed: () => addWashPoints(30, 'VIP'),
                    child: const Text('+30 VIP'),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const Text(
                'แลกรางวัล',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              ...rewardItems.map(
                (item) => Card(
                  child: ListTile(
                    title: Text(item.name),
                    subtitle: Text('ใช้ ${item.cost} แต้ม'),
                    trailing: FilledButton(
                      onPressed: () => redeemReward(item),
                      child: const Text('แลก'),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'ประวัติแต้ม',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              ...transactions.map(
                (item) => Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor:
                          item.isEarn ? Colors.green.shade100 : Colors.red.shade100,
                      child: Icon(
                        item.isEarn ? Icons.add : Icons.remove,
                        color: item.isEarn ? Colors.green : Colors.red,
                      ),
                    ),
                    title: Text(item.title),
                    subtitle: Text(_dateToText(item.date)),
                    trailing: Text(
                      '${item.isEarn ? '+' : '-'}${item.points}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: item.isEarn ? Colors.green : Colors.red,
                      ),
                    ),
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
