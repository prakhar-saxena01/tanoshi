function Topbar(props) {
    return (
        <div className={"w-full px-2 pb-2 flex justify-between fixed inset-x-0 top-0 z-50 bg-accent dark:bg-gray-900 border-b border-accent-darker dark:border-gray-800 text-gray-50 pt-safe-top"}>
            {props.children}
        </div>
    )
}

export default Topbar;