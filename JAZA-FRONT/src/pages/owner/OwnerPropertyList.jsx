import { Card, CardContent, CardHeader, Container } from '@mui/material';
import { useOwner } from '../context/OwnerContext';
import { useProperty } from "../context/PropertyContext";
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function OwnerPropertyList() {

    const { 
        propertyList, selectedProperty, fetchPropertyList, fetchProperty, 
        createProperty, updateProperty, deleteProperty
    } = useProperty();

    const {selectedOwner, fetchLoggedOwner} = useOwner();

    useEffect(() => {
        fetchPropertyList()
    }, [fetchPropertyList]);

    useEffect(() => {
        fetchLoggedOwner()
    }, [selectedOwner]);

    propertyList = propertyList.filter(p => p.OwnerID == selectedOwner.Id);

  return (
    <Container>
        <h1>Your Listings</h1>
        <Grid container>
            {!propertyList && <p class="text-muted">You have no listings yet.</p>}
            {
                propertyList.map(p => {
                    return (
                        <Grid key={p.PropertyID}>
                            <Card>
                                <img src={p.ImageLink} alt={p.StreetAddress} />
                                <CardHeader>Street Address</CardHeader>
                                <CardContent>
                                    <pre>
                                        {p.StreetAddress}, {p.City}, {p.State} {p.ZipCode}<br />
                                        Beds: {p.Bedrooms} Baths: {p.Bathrooms}<br />
                                        Price: ${p.StartingPrice}
                                    </pre>
                                    <Link to={`../properties/${p.StreetAddress}/edit`}>Edit</Link>
                                    <form method="post" onSubmit={() => deleteProperty(p.PropertyID)}>
                                        <Button type="submit">
                                            Delete
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })
            }
        </Grid>
    </Container>
  )
}

export default OwnerPropertyList