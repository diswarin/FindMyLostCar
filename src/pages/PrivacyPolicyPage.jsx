import React from "react";

const PrivacyPolicyPage = () => (
  <div className="max-w-2xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-4">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
    <p className="mb-2">วันที่มีผลบังคับใช้: [ระบุวันที่]</p>
    <p className="mb-4">อัปเดตล่าสุด: [ระบุวันที่]</p>
    <p className="mb-4">
      แพลตฟอร์มนี้จัดทำขึ้นเพื่อช่วยเหลือประชาชนในการรายงานและค้นหายานพาหนะที่สูญหาย โดยพัฒนาและดูแลโดยทีมอาสาสมัครอิสระ (“เรา”) ซึ่งไม่มีความเกี่ยวข้องกับหน่วยงานราชการ หรือเจ้าหน้าที่ตำรวจใด ๆ
    </p>
    <p className="mb-4">
      This Platform is developed and maintained by an independent volunteer team (“we”), and is not affiliated with any government or law enforcement agency.
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-2">1. ข้อมูลที่เราเก็บรวบรวม (Information We Collect)</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>ข้อมูลส่วนตัว: ชื่อ, เบอร์โทรศัพท์, อีเมล (หากระบุโดยสมัครใจ)</li>
      <li>ข้อมูลยานพาหนะ: ทะเบียนรถ, ยี่ห้อ, สี, วัน/เวลาที่หาย, ภาพถ่าย</li>
      <li>ข้อมูลตำแหน่ง: พิกัดหรือสถานที่ที่รถหาย</li>
      <li>ข้อมูลเบาะแส: ภาพประกอบ, รายละเอียด, ตำแหน่ง, ข้อมูลผู้แจ้ง</li>
      <li>ข้อมูลการชำระเงิน (ผ่าน Stripe หรือ TrueMoney): หมายเลขธุรกรรม, ยอดเงิน, ชื่อผู้บริจาค (ถ้ามี)</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">2. วัตถุประสงค์ในการใช้ข้อมูล (How We Use Your Information)</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>แสดงและจัดการรายงานรถหาย</li>
      <li>เปิดให้ผู้ใช้อื่นแจ้งเบาะแส</li>
      <li>ดำเนินการบริจาคและรางวัลนำจับ</li>
      <li>แจ้งเตือนเจ้าของรถเมื่อมีเบาะแส</li>
      <li>พัฒนาประสบการณ์ของแพลตฟอร์มให้ดีขึ้น</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">3. การเก็บรักษาและความปลอดภัย (Data Storage and Security)</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>ข้อมูลจะถูกจัดเก็บอย่างปลอดภัยผ่านบริการบุคคลที่สาม เช่น Supabase, Stripe และ TrueMoney โดยมีมาตรฐานความปลอดภัยระดับอุตสาหกรรม</li>
      <li>เราไม่ขายหรือเปิดเผยข้อมูลส่วนตัวให้กับบุคคลภายนอกเพื่อการโฆษณาใด ๆ</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">4. การเปิดเผยข้อมูลต่อสาธารณะ (Public Disclosure)</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>ข้อมูลที่ผู้ใช้เลือก “เปิดเผยต่อสาธารณะ” เช่น รายงานรถหาย หรือ เบาะแส อาจถูกเผยแพร่ต่อสาธารณะ หรือถูกจัดทำดัชนีโดยเครื่องมือค้นหา (search engine)</li>
      <li>ผู้ใช้ควรระมัดระวังในการให้ข้อมูลส่วนตัวในพื้นที่สาธารณะของแพลตฟอร์ม</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">5. ความรับผิดชอบของผู้ใช้ (User Responsibilities)</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>ไม่แจ้งข้อมูลเท็จหรือสร้างความเข้าใจผิด</li>
      <li>ไม่แอบอ้างเป็นบุคคลอื่น</li>
      <li>ไม่ใช้แพลตฟอร์มในทางที่ผิด เช่น คุกคาม หลอกลวง หรือผิดกฎหมาย</li>
      <li>รับผิดชอบต่อเนื้อหาที่ตนเองเผยแพร่</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">6. การบริจาคและรางวัลนำจับ (Donations & Rewards)</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>การบริจาคและรางวัลนำจับเป็นความสมัครใจ</li>
      <li>ดำเนินการผ่าน Stripe หรือ TrueMoney ซึ่งเป็นระบบภายนอก</li>
      <li>เราไม่เก็บข้อมูลบัตรเครดิตของผู้ใช้งาน</li>
      <li>การโอนเงินรางวัลจะเกิดขึ้นเมื่อมีการตรวจสอบและยืนยันโดยเจ้าของรถหรือแอดมิน</li>
      <li>ทีมผู้พัฒนาไม่รับผิดชอบต่อความล่าช้า หรือข้อผิดพลาดจากระบบของบุคคลที่สาม</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">7. ข้อจำกัดความรับผิด (Limitation of Liability)</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>แพลตฟอร์มนี้ให้บริการ "ตามสภาพ" (as-is) โดยไม่มีการรับประกันใด ๆ</li>
      <li>ทีมพัฒนาไม่รับผิดชอบต่อ:
        <ul className="list-disc pl-6">
          <li>ความเสียหายหรือความสูญเสียที่เกิดจากข้อมูลที่เผยแพร่โดยผู้ใช้</li>
          <li>การแจ้งข้อมูลเท็จหรือคลาดเคลื่อน</li>
          <li>ปัญหาทางเทคนิคหรือข้อผิดพลาดของระบบชำระเงิน</li>
        </ul>
      </li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">8. บริการของบุคคลที่สาม (Third-Party Services)</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>เราใช้บริการต่อไปนี้ในการเก็บและประมวลผลข้อมูล:
        <ul className="list-disc pl-6">
          <li>Supabase</li>
          <li>Stripe</li>
          <li>TrueMoney</li>
        </ul>
      </li>
      <li>ผู้ใช้ควรอ่านและทำความเข้าใจนโยบายของบริการเหล่านั้นแยกต่างหาก</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">9. การเปลี่ยนแปลงนโยบาย (Policy Updates)</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงนโยบายนี้ได้ทุกเมื่อ</li>
      <li>การใช้งานแพลตฟอร์มอย่างต่อเนื่องถือว่าผู้ใช้งานยอมรับการเปลี่ยนแปลงนั้นโดยอัตโนมัติ</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">10. ช่องทางติดต่อ (Contact)</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>หากมีข้อสงสัยหรือข้อร้องเรียนเกี่ยวกับนโยบายนี้ กรุณาติดต่อ:</li>
      <li>📧 [your@email.com]</li>
      <li>📍 ทีมพัฒนาแพลตฟอร์ม (กลุ่มอาสาอิสระ)</li>
    </ul>
  </div>
);

export default PrivacyPolicyPage;