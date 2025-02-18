export default function OffersCard({ offerCardData }) {
  return (
    <>
      <div className="offer-card flex gap-10 justify-center max-sm:p-5 flex-wrap cursor-pointer ">
        {offerCardData?.map((offers) => (
          <div
            key={offers._id}
            className="flex flex-col max-sm:flex-row  flex-wrap border-1 rounded-xl border-gray-500 shadow-md"
          >
            <img
              src={offers.newHeroUrl}
              alt={`${offers.type}-img`}
              className="w-60 h-40 max-sm:w-40 max-sm:h-40 object-cover rounded-tl-xl rounded-tr-xl max-sm:rounded-tr-none max-sm:rounded-bl-xl max-sm:rounded-tl-xl  hover:contrast-125"
            />

            <p className="max-w-60 max-sm:max-w-40 max-sm:text-xs mt-3  p-2">
              <span className="font-semibold text-sm">{offers.pTl}</span>
              <span className="text-xs"> {offers.pTx}</span>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
