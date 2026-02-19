import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_carwash_rewards/main.dart';

void main() {
  testWidgets('แสดงหัวข้อแอปและแต้มเริ่มต้น', (WidgetTester tester) async {
    await tester.pumpWidget(const CarwashRewardsApp());

    expect(find.text('แอปสะสมแต้มร้านล้างรถ'), findsOneWidget);
    expect(find.text('45 แต้ม'), findsOneWidget);
    expect(find.text('ระดับสมาชิก: Classic'), findsOneWidget);
  });

  testWidgets('เพิ่มแต้ม Standard แล้วแต้มเปลี่ยน', (WidgetTester tester) async {
    await tester.pumpWidget(const CarwashRewardsApp());

    await tester.tap(find.widgetWithText(ElevatedButton, '+10 Standard'));
    await tester.pump();

    expect(find.text('55 แต้ม'), findsOneWidget);
  });

  testWidgets('กดรีเซ็ตแล้วกลับค่าเริ่มต้น', (WidgetTester tester) async {
    await tester.pumpWidget(const CarwashRewardsApp());

    await tester.tap(find.widgetWithText(ElevatedButton, '+30 VIP'));
    await tester.pump();
    expect(find.text('75 แต้ม'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.refresh));
    await tester.pump();

    expect(find.text('45 แต้ม'), findsOneWidget);
  });
}
