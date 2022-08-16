import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const { SearchBar } = Search;

const TableBoostrap = (props) => {
    return (
        <ToolkitProvider
            keyField="id"
            data={props.products}
            columns={props.columns}
            search
        >
            {
                props => (
                    <div>
                        {/* <h4>Search:</h4> */}
                        <SearchBar {...props.searchProps} />
                        <hr />
                        <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory()}
                        />
                    </div>
                )
            }
        </ToolkitProvider>
    );
}

export default TableBoostrap;