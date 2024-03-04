export const getOrderMessage = (orderStatus) => {
  switch (orderStatus) {
    case 'Initiated':
      return 'Order Successfully placed';
    case 'Registered':
      return 'Order Successfully placed on BSE';
    case 'Cancelled':
      return 'Order is Cancelled on BSE';
    case 'Failed':
      return 'Order is Failed';
    case 'Success':
      return 'order is successfully registered on BSE';
    default:
      return 'Invalid Order Status';
  }
};

export const getTransactionMessage = (transactionStatus) => {
  switch (transactionStatus) {
    case 'Initiated':
      return 'Order Successfully Placed';
    case 'Placed':
      return 'Order Successfully placed on BSE';
    case 'Payment Initiated':
      return 'Payment Initiated';
    case 'Payment Done':
      return 'Payment is successfully Done';
    case 'Registered':
      return 'Order is successfully registered on BSE';
    case 'Approved':
      return 'Allotment is Done on BSE';
    case 'Alloted':
      return 'RTA allotment is done';
    case 'Failed':
      return 'Order is Failed';
    default:
      return 'Invalid Transaction Status';
  }
};

export const getMandateMessage = (mandateStatus) => {
  switch (mandateStatus) {
    case 'Initiated':
      return 'Mandate order successfully placed';
    case 'Registered':
      return 'Mandate order Successfully registered on BSE';
    case 'Approved':
      return 'Mandate is approved';
    case 'Processing ':
      return 'Exchange has approved mandate, it’s pending from Bank side';
    case 'Failed':
      return 'Mandate is Failed';
    case 'Rejected':
      return 'Mandate is Rejected';
    default:
      return 'Unknown Mandate Status';
  }
};