type props = {
  AccountHolderEmail: string;
  setAccountHolderEmail: (v: string) => void;
  AccountHolderName: string;
  setAccountHolderName: (v: string) => void;
  AccountNumber: string;
  setAccountNumber: (v: string) => void;
  BankName: string;
  setBankName: (v: string) => void;
};
const PaymentInfoCard = ({ AccountHolderEmail, AccountHolderName, AccountNumber, BankName, setAccountHolderEmail, setAccountHolderName, setAccountNumber, setBankName }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Payment Info</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Account Holder Name</div>
            <div className="w-full">
              <input value={AccountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Account Holder Email</div>
            <div className="w-full">
              <input value={AccountHolderEmail} onChange={(e) => setAccountHolderEmail ( e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600"> Bank Name</div>
            <div className="w-full">
              <input value={BankName} onChange={(e) => setBankName ( e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Account Number</div>
            <div className="w-full">
              <input value={AccountNumber} onChange={(e) => setAccountNumber ( e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoCard;
