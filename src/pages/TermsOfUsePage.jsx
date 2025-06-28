import React from "react";

const TermsOfUsePage = () => (
  <div className="max-w-2xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-4">Terms of Use (ข้อกำหนดในการใช้งาน)</h1>
    <p className="mb-2">Effective Date: [ระบุวันที่]</p>
    <p className="mb-4">Last Updated: [ระบุวันที่ล่าสุด]</p>

    <h2 className="text-xl font-semibold mt-8 mb-2">1. การยอมรับข้อกำหนด</h2>
    <p className="mb-4">
      การใช้งานแพลตฟอร์มนี้แสดงว่าคุณยอมรับข้อกำหนดทั้งหมด หากคุณไม่เห็นด้วย กรุณาหยุดใช้งานทันที
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-2">2. วัตถุประสงค์ของแพลตฟอร์ม</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>แพลตฟอร์มนี้จัดทำเพื่อช่วยรายงานและค้นหารถหาย โดยอาศัยความร่วมมือจากสาธารณะ</li>
      <li>ไม่ใช่ระบบของหน่วยงานราชการหรือเจ้าหน้าที่ตำรวจ</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">3. ความรับผิดชอบของผู้ใช้</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>แจ้งข้อมูลเท็จ หลอกลวง หรือบิดเบือน</li>
      <li>คุกคาม หรือแอบอ้างเป็นบุคคลอื่น</li>
      <li>ใช้ระบบบริจาค/รางวัลในทางที่ผิด</li>
      <li>ใช้งานเพื่อวัตถุประสงค์ที่ผิดกฎหมาย</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">4. บัญชีและตัวตน</h2>
    <p className="mb-4">
      ผู้ใช้อาจต้องยืนยันตัวตนด้วยอีเมล โซเชียล หรือเบอร์โทรศัพท์ และมีหน้าที่รักษาความปลอดภัยของบัญชี
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-2">5. ความพร้อมในการให้บริการ</h2>
    <p className="mb-4">
      เราไม่รับประกันว่าแพลตฟอร์มจะพร้อมใช้งานตลอดเวลา อาจมีการหยุดชั่วคราวหรือข้อผิดพลาดโดยไม่แจ้งล่วงหน้า
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-2">6. การบริจาคและรางวัล</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>การบริจาคและรางวัลเป็นการให้โดยสมัครใจและไม่สามารถขอคืนได้</li>
      <li>แอดมินมีสิทธิ์ระงับการจ่ายรางวัลหากพบพฤติกรรมฉ้อโกง</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">7. ข้อจำกัดความรับผิด</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>ทีมพัฒนาไม่รับผิดชอบต่อ:</li>
      <ul className="list-disc pl-6">
        <li>ความถูกต้องของข้อมูลที่ผู้ใช้งานป้อน</li>
        <li>ความเสียหายหรือผลกระทบทางกฎหมายใด ๆ</li>
        <li>ข้อผิดพลาดจากบริการของบุคคลที่สาม (เช่น Supabase, Stripe, TrueMoney)</li>
      </ul>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">8. การยุติการใช้งาน</h2>
    <p className="mb-4">
      ทีมงานมีสิทธิ์ระงับหรือปิดบัญชีผู้ใช้ที่ละเมิดข้อกำหนดนี้ โดยไม่จำเป็นต้องแจ้งล่วงหน้า
    </p>
  </div>
);

export default TermsOfUsePage