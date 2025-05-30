import { Button, Container, Grid } from '@mui/material'
import { useProperty } from "../context/PropertyContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from 'react'
import Popup from "reactjs-popup";
import CreateProperty from './CreateProperty';
import NavBar from "../shared/NavBar";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { api } from "../services/api";
import PropertyCard from './PropertyCard';




function UserPropertyList() {
    const { user } = useAuth();

    const {
        propertyList, selectedProperty, fetchPropertyList, fetchProperty,
        createProperty, updateProperty, deleteProperty
    } = useProperty();
    const [filteredResults, setFilteredResults] = useState([]);

    const [selectedProp, setSelectedProp] = useState(null);
    const [createPopupOpen, setCreatePopupOpen] = useState(false);
    const [detailPopupOpen, setDetailPopupOpen] = useState(false);


    useEffect(() => {
        fetchPropertyList()
    }, [fetchPropertyList]);

    const handleClick = (propertyID) => {
        const property = propertyList.find(p => p.propertyID === propertyID);
        if (property) {
            setSelectedProp(property);
            setDetailPopupOpen(true);
        }
    };

    const handleCreate = () => {
        setCreatePopupOpen(true);
    };

    const [bed, setBed] = useState('');
    const [bath, setBath] = useState('');
    const handleBedChange = (event) => {
        setBed(event.target.value);
    };
    const handleBathChange = (event) => {
        setBath(event.target.value);
    };
    useEffect(() => {
        const fetchPropertiesWithFilters = async () => {
            try {
                const params = {};
                if (bed !== '') params.bedrooms = bed;
                if (bath !== '') params.bathrooms = bath;

                const response = await api.get("properties", { params });
                if (response.data) {
                    let exactFilter = response.data;
                    if (bed !== '') {
                        exactFilter = exactFilter.filter(p => p.bedrooms === Number(bed));
                    }

                    if (bath !== '') {
                        exactFilter = exactFilter.filter(p => p.bathrooms === Number(bath));
                    }
                    setFilteredResults(exactFilter);
                }
            } catch (error) {
                console.error("Error fetching properties with filters:", error);
            }
        };

        fetchPropertiesWithFilters();
    }, [bed, bath]);


    return (
        <>
            <NavBar />
            <Container maxWidth={false}>
                <Grid container spacing={3}>
                    <Grid size={8}>
                        <h3>Listings</h3>
                    </Grid>
                    <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="bed-label">Bedrooms</InputLabel>
                            <Select
                                labelId="bed-label"
                                id="bed-select"
                                value={bed}
                                onChange={handleBedChange}
                                label="Bedrooms"
                            >
                                <MenuItem value="">
                                    <em>Any</em>
                                </MenuItem>
                                <MenuItem value={1}>1 Bedroom</MenuItem>
                                <MenuItem value={2}>2 Bedrooms</MenuItem>
                                <MenuItem value={3}>3 Bedrooms</MenuItem>
                                <MenuItem value={4}>4 Bedrooms</MenuItem>
                                <MenuItem value={5}>5 Bedrooms</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="bath-label">Bathrooms</InputLabel>
                            <Select
                                labelId="bath-label"
                                id="bath-select"
                                value={bath}
                                onChange={handleBathChange}
                                label="Bathrooms"
                            >
                                <MenuItem value="">
                                    <em>Any</em>
                                </MenuItem>
                                <MenuItem value={1}>1 Bathroom</MenuItem>
                                <MenuItem value={2}>2 Bathrooms</MenuItem>
                                <MenuItem value={3}>3 Bathrooms</MenuItem>
                                <MenuItem value={4}>4 Bathrooms</MenuItem>
                                <MenuItem value={5}>5 Bathrooms</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        {user && <Button onClick={handleCreate} sx={{ all: 'unset', cursor: 'pointer', marginTop: '15px' }}>Create Listing</Button>}
                    </Grid>
                    {(filteredResults.length > 0 ? filteredResults : propertyList).map(p => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={p.propertyID}>
                            <PropertyCard property={p} />
                        </Grid>
                    ))}
                </Grid>
                <Popup
                    open={createPopupOpen}
                    closeOnDocumentClick
                    onClose={() => setCreatePopupOpen(false)}
                    modal
                    nested
                    overlayStyle={{
                        background: "rgba(0, 0, 0, 0.5)",
                    }}
                    contentStyle={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "10px",
                        padding: "30px",
                        maxWidth: "80vw",
                        width: "80%",
                        height: '80vh',
                        margin: "auto",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                        fontFamily: "Arial, sans-serif",
                        position: 'relative',
                        overflowY: 'auto',
                    }}
                >
                    <div>
                        <button
                            onClick={() => setCreatePopupOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: 'black',
                            }}
                        >
                            ×
                        </button>
                        <CreateProperty />
                    </div>
                </Popup>
            </Container >
        </>
    )
}

export default UserPropertyList



