// BusinessProductList.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import BusinessProductItem from "./BusinessProductItem";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: any;
}

interface Props {
  products: Product[];
  storeId: string;
  storeType: 'restaurant' | 'grocery' | 'shop';
  onAdd: (item: Product, quantity: number) => void;
}

const BusinessProductList: React.FC<Props> = ({
  products,
  storeId,
  storeType,
  onAdd,
}) => {
  return (
    <View style={styles.container}>
      {products.map((product) => (
       <BusinessProductItem
  key={product.id}
  product={product}
  storeId={storeId}
  storeType={storeType}
  onAdd={onAdd}
/>
      ))}
    </View>
  );
};

export default BusinessProductList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    gap: 15,
    backgroundColor: "#fff",
  },
});
