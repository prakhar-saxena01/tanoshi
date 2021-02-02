import React from 'react';
import Cover from './common/Cover';
import Topbar from './common/Topbar';
import { useMatch } from '@reach/router';
import Select from 'react-select';

function Input(props) {
    const { isMultiple, values } = props;

    let options = [];
    if (values) {
        options = values.map(v => {
            return {
                label: v.Label,
                value: v.Value
            }
        })
    }

    const styleOption = props => {
        const {
          children,
          className = "bg-gray-200 dark:bg-gray-700",
          cx,
          getStyles,
          isDisabled,
          isFocused,
          isSelected,
          innerRef,
          innerProps
        } = props;
        return (
          <div
            ref={innerRef}
            css={getStyles("option", props)}
            className={cx(
              {
                option: true,
                "option--is-disabled": isDisabled,
                "option--is-focused": isFocused,
                "option--is-selected": isSelected
              },
              `${className} custom-class-name`
            )}
            {...innerProps}
          >
            {children}
          </div>
        );
      };

    if (!isMultiple && values && values.length > 0) {
        return (
            <Select components={{ styleOption }} options={options} />
        )
    } else if (isMultiple && values && values.length > 0) {
        return (
            <Select components={{ styleOption }} isMulti options={options} />
        )
    }
    return (
        <input className={"w-full focus:outline-none p-1 dark:bg-gray-700 text-gray-900 dark:text-gray-100"} type="text"></input>
    )
}

function Section(props) {
    const { label, isMultiple, values, field } = props;

    return (
        <div className={"w-full"}>
            <label>{label}</label>
            <div className={"w-full bg-gray-200 dark:bg-gray-700 rounded p-1"}>
                <Input isMultiple={isMultiple} values={values} />
            </div>
        </div>
    )
}

function Filter(props) {
    const { filters } = props;

    return (
        <div className={"p-2"}>
            <div className={"shadow w-full p-4 rounded-t lg:rounded mb-0 lg:mb-2 mx-auto inset-x-0 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 mx-2"}>
                <div className={"w-full flex flex-col justify-between border-b border-gray-10 dark:border-gray-900 mb-2"}>
                    <div className={"w-full flex justify-between border-b border-gray-10 dark:border-gray-900 mb-2"}>
                        <h1>Filters</h1>
                    </div>
                    {filters && filters.map(f => (
                        <Section label={f.Label} isMultiple={f.IsMultiple} values={f.Values} field={f.Field} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function Skeleton(props) {
    return (
        <div>
            <Topbar>
                <span></span>
                <span className={"text-gray-300"}>{`Browse ${props.sourceName}`}</span>
                <button>Filters</button>
            </Topbar>
            <div className={"px-2 ml-0 pb-safe-bottom-scroll"}>
                <div className={`animate-tw-pulse w-full grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2`}>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                </div>
            </div>
        </div>
    )
}

function BrowseSource(props) {
    const [isLoading, setLoading] = React.useState(false);
    const [filters, setFilters] = React.useState([]);
    const [mangaList, setMangaList] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [isSearch, setSearch] = React.useState(false);
    const [keyword, setKeyword] = React.useState("");

    const isLatest = useMatch("/browse/:sourceName/latest");

    React.useEffect(() => {
        setLoading(true);

        let url = `/api/source/${props.sourceName}`
        if (isLatest) {
            url += `/latest?page=${page}`
        } else {
            url += `?page=${page}`
            url += keyword !== "" ? "&title=" + keyword : ""
        }
        fetch(url)
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    return []
                }
            })
            .then((data) => {
                setMangaList(m => [...m, ...data]);
                setLoading(false);
            }).catch((e) => {
                console.log(e);
            });
        // eslint-disable-next-line
    }, [props.sourceName, keyword, page])

    React.useEffect(() => {
        setLoading(true);

        let url = `/api/source/${props.sourceName}/filters`;
        fetch(url)
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    return {}
                }
            })
            .then((data) => {
                setFilters(data);
            }).catch((e) => {
                console.log(e);
            });
        // eslint-disable-next-line
    }, [props.sourceName])

    if (mangaList.length === 0 && isLoading) {
        return (
            <Skeleton sourceName={props.sourceName} />
        )
    }

    return (
        <div>
            <Topbar>
                <span></span>
                <span className={"text-gray-300"}>{`Browse ${props.sourceName}`}</span>
                <button>Filters</button>
            </Topbar>
            <div className={"fixed z-50 right-0 top-0 mt-10 w-full md:w-auto"}>
                <Filter filters={filters} />
            </div>
            <div className={"px-2 ml-0 pb-safe-bottom-scroll"}>
                <div className={`w-full grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2`}>
                    {mangaList.map((el, index) => (
                        <Cover key={index} id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
                    ))}
                </div>
                <button disabled={isLoading} className={"w-full mt-2 p-1 text-accent rounded shadow-sm dark:bg-gray-800 hover:shadow dark:hover:bg-gray-700"} onClick={() => setPage(page + 1)}>
                    {isLoading ? "Loading..." : "Load More"}
                </button>
            </div>
        </div>
    )
}

export default BrowseSource;