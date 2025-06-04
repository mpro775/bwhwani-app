// import React, { useEffect, useState } from "react";

// interface Bid {
//   name: string;
//   amount: number;
//   at: string;
// }

// const AuctionBids = ({ productId }: { productId: string }) => {
//   const [bids, setBids] = useState<Bid[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBids = async () => {
//       try {
//         const res = await fetch(`/market/products/${productId}/bids`);
//         const data = await res.json();
//         setBids(data);
//       } catch (error) {
//         console.error("Error fetching bids:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBids();
//   }, [productId]);

//   if (loading) return <p>جارٍ تحميل المزايدات...</p>;
//   if (bids.length === 0) return <p>لا توجد مزايدات بعد.</p>;

//   return (
//     <div className="space-y-2">
//       {bids.map((bid, index) => (
//         <Card key={index} className="p-2">
//           <CardContent className="flex justify-between items-center">
//             <div>
//               <p className="font-semibold">{bid.name}</p>
//               <p className="text-sm text-gray-500">{new Date(bid.at).toLocaleString()}</p>
//             </div>
//             <div className="text-lg font-bold text-green-600">
//               {bid.amount.toLocaleString()} ﷼
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default AuctionBids;
