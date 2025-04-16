import React from "react";
import { Button, Result } from "antd";

interface PaymentSuccessProps {
  handleChangePage: (page: string) => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ handleChangePage }) => {
  return (
    <div style={{ padding: 20, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle="Đơn hàng của bạn đã được thanh toán. Cảm ơn bạn đã mua sắm!"
        extra={[
          <Button
            type="primary"
            key="back"
            onClick={() => handleChangePage("Danh sách đơn hàng")}
          >
            Quay lại danh sách đơn hàng
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaymentSuccess;