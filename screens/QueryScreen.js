import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from "react-native";

const QueryScreen = () => {
  const [data, setData] = useState([]);
  const [selectedIl, setSelectedIl] = useState(null);
  const [selectedIlce, setSelectedIlce] = useState(null);
  const [selectedTarih, setSelectedTarih] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://www.sedas.com/Home/Get_PlannedListAll");
      const jsonData = await response.json();
      setData(jsonData.Data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getUniqueIls = () => {
    const uniqueIls = [...new Set(data.map((item) => item.ZIL))];
    return uniqueIls;
  };

  const getUniqueIlces = (selectedIl) => {
    const filteredData = data.filter((item) => item.ZIL === selectedIl);
    const uniqueIlces = [...new Set(filteredData.map((item) => item.ZILCE))];
    return uniqueIlces;
  };

  const handleIlPress = (il) => {
    setSelectedIl(il);
    setSelectedIlce(null);
    setSelectedTarih(null);
  };

  const handleIlcePress = (ilce) => {
    setSelectedIlce(ilce);
    setSelectedTarih(null);
  };

  const handleTarihPress = (tarih) => {
    setSelectedTarih(tarih);
  };

  const renderBreadcrumb = () => {
    return (
      <View style={styles.breadcrumbContainer}>
        <TouchableOpacity onPress={() => handleIlPress(null)} disabled={!selectedIl}>
          <Text style={[styles.breadcrumbItem, !selectedIl && styles.breadcrumbItemDisabled]}>İl</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIlcePress(null)} disabled={!selectedIlce}>
          <Text style={[styles.breadcrumbItem, !selectedIlce && styles.breadcrumbItemDisabled]}>İlçe</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTarihPress(null)} disabled={!selectedTarih}>
          <Text style={[styles.breadcrumbItem, !selectedTarih && styles.breadcrumbItemDisabled]}>Tarih</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderIl = ({ item }) => {
    return (
      <TouchableOpacity style={[styles.itemContainer, styles.itemContainerIl]} onPress={() => handleIlPress(item)}>
        <Text style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderIlce = ({ item }) => {
    return (
      <TouchableOpacity style={[styles.itemContainer, styles.itemContainerIlce]} onPress={() => handleIlcePress(item)}>
        <Text style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderTarih = ({ item }) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => handleTarihPress(item)}>
        <Text style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderDetay = () => {
    if (selectedTarih) {
      const filteredData = data.filter((item) => item.ZIL === selectedIl && item.ZILCE === selectedIlce && item.ZPLANTAR === selectedTarih);

      return (
        <View style={styles.detayContainer}>
          <Text style={styles.detayText}>Detaylar:</Text>
          {filteredData.map((item, index) => (
            <Text key={index} style={styles.detayText}>
              {`${item.ZCSBM} - Başlangıç: ${item.ZBASSAAT} - Bitiş: ${item.ZBITSAAT}`}
            </Text>
          ))}
        </View>
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!selectedIl) {
    const uniqueIls = getUniqueIls();
    return (
      <View style={styles.container}>
        {renderBreadcrumb()}
        <FlatList data={uniqueIls} renderItem={renderIl} keyExtractor={(item) => item} contentContainerStyle={styles.listContainer} />
      </View>
    );
  }

  if (!selectedIlce) {
    const uniqueIlces = getUniqueIlces(selectedIl);
    return (
      <View style={styles.container}>
        {renderBreadcrumb()}
        <FlatList data={uniqueIlces} renderItem={renderIlce} keyExtractor={(item) => item} contentContainerStyle={styles.listContainer} />
      </View>
    );
  }

  const filteredTarihler = data.filter((item) => item.ZIL === selectedIl && item.ZILCE === selectedIlce).map((item) => item.ZPLANTAR);

  return (
    <View style={styles.container}>
      {renderBreadcrumb()}
      <FlatList data={filteredTarihler} renderItem={renderTarih} keyExtractor={(item) => item} contentContainerStyle={styles.listContainer} />
      {renderDetay()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemContainerIl: {
    backgroundColor: "#f2f2f2",
  },
  itemContainerIlce: {
    paddingLeft: 20,
    backgroundColor: "#fff",
  },
  itemText: {
    fontSize: 16,
  },
  breadcrumbContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  breadcrumbItem: {
    fontSize: 16,
    marginRight: 10,
    color: "#007bff",
    textDecorationLine: "underline",
  },
  breadcrumbItemDisabled: {
    color: "#999",
    textDecorationLine: "none",
  },
  detayContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  detayText: {
    marginBottom: 10,
  },
});

export default QueryScreen;
