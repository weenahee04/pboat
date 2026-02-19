# Flutter Carwash Rewards

แอป Flutter สำหรับสะสมแต้มร้านล้างรถแบบง่าย ๆ พร้อมโหมดทดสอบในหน้าหลัก

## ฟีเจอร์
- บันทึกแต้มจากบริการล้างรถแต่ละครั้ง
- แสดงสถานะสมาชิก (Classic / Silver / Gold)
- ประวัติการทำรายการแต้ม
- แลกของรางวัลเมื่อแต้มถึงเงื่อนไข
- โหมดทดสอบ: รีเซ็ตข้อมูลเริ่มต้นได้ทันทีจากปุ่มรีเฟรช

## เปิดดูเป็นเว็บยังไง (เร็วสุด)
1. เข้าโฟลเดอร์โปรเจกต์
   ```bash
   cd flutter_carwash_rewards
   ```
2. ดาวน์โหลดแพ็กเกจ
   ```bash
   flutter pub get
   ```
3. รันบน Chrome
   ```bash
   flutter run -d chrome
   ```
4. ถ้าเครื่องไม่มี Chrome แต่มีเบราว์เซอร์อื่น ให้รันแบบ web-server
   ```bash
   flutter run -d web-server --web-hostname 0.0.0.0 --web-port 8080
   ```
   แล้วเปิด `http://localhost:8080`

## วิธีรัน (เครื่องที่มี Flutter SDK)
1. ติดตั้ง Flutter SDK
2. เข้าโฟลเดอร์โปรเจกต์
   ```bash
   cd flutter_carwash_rewards
   ```
3. ติดตั้งแพ็กเกจ
   ```bash
   flutter pub get
   ```
4. รันแอป
   ```bash
   flutter run
   ```

## วิธีทดสอบแบบไม่ต้องติดตั้ง Flutter (ผ่าน Docker)
> ต้องมี Docker ก่อน

1. เข้าโฟลเดอร์โปรเจกต์
   ```bash
   cd flutter_carwash_rewards
   ```
2. รัน unit/widget tests
   ```bash
   docker run --rm -v "$PWD":/app -w /app ghcr.io/cirruslabs/flutter:stable flutter test
   ```
3. รันแอปบนเว็บเซิร์ฟเวอร์
   ```bash
   docker run --rm -it -p 8080:8080 -v "$PWD":/app -w /app ghcr.io/cirruslabs/flutter:stable flutter run -d web-server --web-hostname 0.0.0.0 --web-port 8080
   ```
4. เปิดเบราว์เซอร์ที่ `http://localhost:8080`

## สิ่งที่ให้ทดลองในแอป
- กดปุ่ม `+10/+20/+30` แล้วเช็กแต้มเพิ่ม
- กดแลกรางวัลที่แต้มพอ/ไม่พอ เพื่อดูเงื่อนไข
- กดปุ่มรีเฟรชบน AppBar เพื่อรีเซ็ตข้อมูลเดโม
