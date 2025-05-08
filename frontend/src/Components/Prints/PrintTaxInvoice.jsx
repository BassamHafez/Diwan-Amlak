import PrintCashReceipt from "./PrintCashReceipt";

const PrintTaxInvoice = ({ revDetails, estateParentCompound, details, id,taxNumber }) => {
  return (
    <>
      <PrintCashReceipt
        revDetails={revDetails}
        details={details}
        estateParentCompound={estateParentCompound}
        id={id}
        isTax={true}
        taxNumber={taxNumber}
      />
      
    </>
  );
};

export default PrintTaxInvoice;
