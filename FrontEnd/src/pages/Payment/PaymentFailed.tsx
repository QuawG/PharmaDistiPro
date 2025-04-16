import React from "react";
import { Button, Result } from "antd";

interface PaymentFailedProps {
  handleChangePage: (page: string) => void;
}

const PaymentFailed: React.FC<PaymentFailedProps> = ({ handleChangePage }) => {
  return (
    <div style={{ padding: 20, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Result
        status="error"
        title="Thanh toán thất bại!"
        subTitle="Có lỗi xảy ra trong quá trình thanh toán hoặc bạn đã hủy giao dịch. Vui lòng thử lại."
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

export default PaymentFailed;