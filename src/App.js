import React, { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [dataList, setDataList] = useState([]);
  const [search, setSearch] = useState("");
  const [showDetailsIndex, setShowDetailsIndex] = useState(-1);
  const [showModifyIndex, setShowModifyIndex] = useState(-1);
  const [showAppend, setShowAppend] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem(Date.now());
    if (storedData) {
      const { name, number } = JSON.parse(storedData);
      setName(name);
      setNumber(number);
    }
  });

  const handleSave = () => {
    if(showAppend === false) {
      setShowAppend(true);
    } else {setShowAppend(false);}
    if(name && number){
      const data = { name, number };
      localStorage.setItem(Date.now(), JSON.stringify(data));
    }
    setName("");
    setNumber("");
  };

  useEffect(() => {
    const allData = { ...localStorage };
    const parsedDataList = Object.entries(allData).map(([key, value]) => ({
      key,
      value: JSON.parse(value),
    }));
    setDataList(parsedDataList);
  }, []);

  const toggleDetails = (index) => {
    if (showDetailsIndex === index) {
      setShowDetailsIndex(-1);
    } else {
      setShowDetailsIndex(index);
    }
  };

  const modifyDetails = (index) => {
    if (showModifyIndex === index) {
      setShowModifyIndex(-1);
    } else {
      setShowModifyIndex(index);
    }
  };

  const handleChangeSave = (key) => {
    const modData = { name, number };
    localStorage.setItem(key, JSON.stringify(modData));
  };

  const deletefunction = (key) => {
    if(window.confirm("삭제하시겠습니까?")) {
      localStorage.removeItem(key);
      alert("삭제완료");
    } else { alert("취소"); }
  }

  const handleSearch = () => {
    // Filter the dataList based on the searchQuery
    const filteredData = dataList.filter(
      (data) =>
        data.value.name.toLowerCase().includes(search.toLowerCase()) ||
        data.value.number.toLowerCase().includes(search.toLowerCase())
    );
    setDataList(filteredData);
  };

  // 삭제기능

  const searchClear = () => {
      const allData = { ...localStorage };
      const parsedDataList = Object.entries(allData).map(([key, value]) => ({
        key,
        value: JSON.parse(value),
      }));
      setDataList(parsedDataList);
      setSearch('');
  }

  return (
    <div>
      <hr/>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search ... "
      />
      <button onClick={handleSearch}> 🔍 </button>
      <button onClick={searchClear}> 🔄 </button>
      <button onClick={() => {
	      if(window.confirm("삭제하시겠습니까?")) {
    	    localStorage.clear();
    	    alert("삭제완료");
        } else { alert("취소"); }
      }}>clear all</button>
      <br />
      {showAppend ?
      <div>
      <form>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="text"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Number"
      />
      </form>
      </div> : null}
      <button onClick={handleSave}> {showAppend ? "done" : "add"} </button>

      <hr/>
      <div>
        <h4>Name | Contact</h4>
        {dataList.map((data, index) => (
          <div key={data.key}>
            <p>
              {data.value.name} | {data.value.number}{' '}
              <button onClick={() => toggleDetails(index)}> ... </button>
            </p>
            {showDetailsIndex === index && (
              <div>
                details : ...
                <br /> 
                <button onClick={()=>modifyDetails(index)}>🔄</button>
                <button onClick={()=>deletefunction(data.key)}>❎</button>
                {showModifyIndex === index && (
                  <div>
                  <input
                    type="text"
                    value={index.modName}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={index.modNumber}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Number"
                  />
                  <button onClick={handleChangeSave(data.key)}>Confirm</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
